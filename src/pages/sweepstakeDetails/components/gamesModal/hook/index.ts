import { useState, useCallback, useEffect, useMemo } from 'react'

import { setSweepstakeGames, setSweepstakeResult } from '@services/sweepstakes'
import { allocateGamesByBudget, generateRandomGame, generateAllocatedGames } from '@utils/gameAllocation'
import { getLotteryRule, getGamePrice } from '@utils/lotteryRules'
import { parseNumbers } from '../../../utils/games'
import useAction from '@hooks/useAction'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { UseGamesModalReturn } from './types'
import type { NumberEntry } from '../types'

const useGamesModal = (
  sweepstake: SweepstakeDetailsResponse,
  open: boolean,
  onUpdate: () => Promise<void>
): UseGamesModalReturn => {
  const [lotteryType, setLotteryType] = useState<string>(sweepstake.lotteryType || 'megasena')
  const [games, setGames] = useState<number[][]>(sweepstake.games ?? [])
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [newGameInput, setNewGameInput] = useState('')
  const [resultInput, setResultInput] = useState((sweepstake.result ?? []).join(', '))
  const [isSavingGames, setIsSavingGames] = useState(false)
  const [isSavingResult, setIsSavingResult] = useState(false)

  const rule = useMemo(() => getLotteryRule(lotteryType), [lotteryType])
  const [targetCount, setTargetCount] = useState<number>(rule.minNumbers)

  useEffect(() => {
    if (!open) return
    const initialType = sweepstake.lotteryType || 'megasena'
    setLotteryType(initialType)
    const initialRule = getLotteryRule(initialType)
    setTargetCount(initialRule.minNumbers)
    setGames(sweepstake.games ?? [])
    setResultInput((sweepstake.result ?? []).join(', '))
    setNewGameInput('')
    setSelectedNumbers([])
  }, [open, sweepstake])

  // Ajusta targetCount se a regra mudar
  useEffect(() => {
    if (targetCount < rule.minNumbers || targetCount > rule.maxNumbers) {
      setTargetCount(rule.minNumbers)
    }
    setSelectedNumbers((prev) => prev.filter((n) => n <= rule.totalNumbers))
  }, [rule])

  const filledQuotas = sweepstake.participations?.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0) ?? 0
  const availableBudget = Number((filledQuotas * sweepstake.quotaPrice).toFixed(2))

  const totalCurrentCost = useMemo(() => {
    return Number(
      games.reduce((acc, g) => acc + getGamePrice(lotteryType, g.length), 0).toFixed(2)
    )
  }, [games, lotteryType])

  const balance = Number((availableBudget - totalCurrentCost).toFixed(2))

  const allocationSuggestion = useMemo(() => {
    return allocateGamesByBudget(lotteryType, availableBudget)
  }, [lotteryType, availableBudget])

  const toggleNumber = useCallback(
    (num: number) => {
      setSelectedNumbers((prev) => {
        if (prev.includes(num)) {
          return prev.filter((n) => n !== num)
        }
        if (prev.length >= targetCount) {
          // Se já atingiu o alvo, substitui o primeiro ou apenas não adiciona
          return prev
        }
        return [...prev, num].sort((a, b) => a - b)
      })
    },
    [targetCount]
  )

  const generateSurpresinha = useCallback(() => {
    const random = generateRandomGame(lotteryType, targetCount)
    setSelectedNumbers(random)
  }, [lotteryType, targetCount])

  const clearSelectedNumbers = useCallback(() => {
    setSelectedNumbers([])
  }, [])

  const addCurrentGame = useCallback((): boolean => {
    if (selectedNumbers.length < rule.minNumbers) {
      return false
    }
    const sorted = [...selectedNumbers].sort((a, b) => a - b)
    setGames((prev) => [...prev, sorted])
    setSelectedNumbers([])
    return true
  }, [selectedNumbers, rule.minNumbers])

  const addGameFromInput = useCallback(() => {
    if (!newGameInput.trim()) return

    // Suporta múltiplas linhas ou um único jogo
    const lines = newGameInput.split('\n').map((l) => l.trim()).filter(Boolean)
    const newGamesToAdd: number[][] = []

    for (const line of lines) {
      const numbers = parseNumbers(line)
      if (numbers.length >= rule.minNumbers) {
        // Remove duplicados dentro do jogo e filtra valores fora do range
        const unique = Array.from(new Set(numbers.filter((n) => n <= rule.totalNumbers))).sort((a, b) => a - b)
        if (unique.length >= rule.minNumbers) {
          newGamesToAdd.push(unique)
        }
      }
    }

    if (newGamesToAdd.length > 0) {
      setGames((prev) => [...prev, ...newGamesToAdd])
      setNewGameInput('')
    }
  }, [newGameInput, rule.minNumbers, rule.totalNumbers])

  const removeGame = useCallback((index: number) => {
    setGames((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearAllGames = useCallback(() => {
    setGames([])
  }, [])

  const applySuggestion = useCallback(() => {
    const suggestedGames = generateAllocatedGames(lotteryType, allocationSuggestion.allocations)
    if (suggestedGames.length > 0) {
      setGames((prev) => [...prev, ...suggestedGames])
    }
  }, [lotteryType, allocationSuggestion])

  const handleSaveGames = useCallback(async () => {
    setIsSavingGames(true)
    try {
      await useAction({
        action: () => setSweepstakeGames(sweepstake.id, { games }),
        callback: () => onUpdate()
      })
    } finally {
      setIsSavingGames(false)
    }
  }, [sweepstake.id, games, onUpdate])

  const handleSaveResult = useCallback(async () => {
    const parsed = parseNumbers(resultInput)
    if (!parsed.length) return
    setIsSavingResult(true)
    try {
      await useAction({
        action: () => setSweepstakeResult(sweepstake.id, { result: parsed }),
        callback: () => onUpdate()
      })
    } finally {
      setIsSavingResult(false)
    }
  }, [sweepstake.id, resultInput, onUpdate])

  const getMatchedNumbers = useCallback(
    (game: number[]): NumberEntry[] => {
      const resultSet = new Set(parseNumbers(resultInput))
      return game.map((n) => ({ number: n, matched: resultSet.has(n) }))
    },
    [resultInput]
  )

  const getHitsCount = useCallback(
    (game: number[]): number => {
      const resultSet = new Set(parseNumbers(resultInput))
      return game.filter((n) => resultSet.has(n)).length
    },
    [resultInput]
  )

  return {
    games,
    selectedNumbers,
    targetCount,
    lotteryType,
    rule,
    availableBudget,
    totalCurrentCost,
    balance,
    allocationSuggestion,
    newGameInput,
    resultInput,
    isSavingGames,
    isSavingResult,
    setNewGameInput,
    setResultInput,
    setTargetCount,
    setLotteryType,
    toggleNumber,
    generateSurpresinha,
    clearSelectedNumbers,
    addCurrentGame,
    addGameFromInput,
    removeGame,
    clearAllGames,
    applySuggestion,
    handleSaveGames,
    handleSaveResult,
    getMatchedNumbers,
    getHitsCount
  }
}

export default useGamesModal