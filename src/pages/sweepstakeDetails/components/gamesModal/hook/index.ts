import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

import { setSweepstakeGames, setSweepstakeResult } from '@services/sweepstakes'
import { allocateGamesByBudget, generateRandomGame, generateAllocatedGames } from '@utils/gameAllocation'
import { getLotteryRule, getGamePrice } from '@utils/lotteryRules'
import { getLotteryByType } from '@services/lotteries'
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
  const [resultNumbers, setResultNumbers] = useState<number[]>(sweepstake.result ?? [])
  const [resultInput, setResultInput] = useState((sweepstake.result ?? []).join(', '))
  const [isSavingGames, setIsSavingGames] = useState(false)
  const [isSavingResult, setIsSavingResult] = useState(false)
  const [isFetchingCaixaResult, setIsFetchingCaixaResult] = useState(false)

  const rule = useMemo(() => getLotteryRule(lotteryType), [lotteryType])
  const [targetCount, setTargetCount] = useState<number>(rule.minNumbers)

  useEffect(() => {
    if (!open) return
    const initialType = sweepstake.lotteryType || 'megasena'
    setLotteryType(initialType)
    const initialRule = getLotteryRule(initialType)
    setTargetCount(initialRule.minNumbers)
    setGames(sweepstake.games ?? [])
    const initialResult = sweepstake.result ?? []
    setResultNumbers(initialResult)
    setResultInput(initialResult.join(', '))
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
    const numbersToSave = resultNumbers.length > 0 ? resultNumbers : parseNumbers(resultInput)
    if (!numbersToSave.length) {
      toast.warn('Selecione ou digite as dezenas sorteadas antes de salvar.')
      return
    }
    setIsSavingResult(true)
    try {
      await useAction({
        action: () => setSweepstakeResult(sweepstake.id, { result: numbersToSave }),
        callback: () => onUpdate(),
        toastMessages: {
          success: 'Resultado do sorteio salvo com sucesso!',
          pending: 'Salvando resultado...',
          error: 'Erro ao salvar resultado'
        }
      })
    } finally {
      setIsSavingResult(false)
    }
  }, [sweepstake.id, resultNumbers, resultInput, onUpdate])

  const handleFetchCaixaResult = useCallback(async () => {
    setIsFetchingCaixaResult(true)
    try {
      const data = await getLotteryByType(lotteryType, sweepstake.contestNumber)
      if (data && data.lastDrawnNumbers && data.lastDrawnNumbers.length > 0) {
        const numbers = data.lastDrawnNumbers.map(Number).sort((a, b) => a - b)
        setResultNumbers(numbers)
        setResultInput(numbers.join(', '))
        toast.success(`Resultado obtido com sucesso da Caixa! Concurso #${data.contestNumber}`)
      } else {
        toast.warn('Nenhum resultado de sorteio foi retornado pela Caixa para este concurso.')
      }
    } catch {
      toast.error('Não foi possível obter o resultado da Caixa Econômica.')
    } finally {
      setIsFetchingCaixaResult(false)
    }
  }, [lotteryType, sweepstake.contestNumber])

  const toggleResultNumber = useCallback(
    (num: number) => {
      setResultNumbers((prev) => {
        let updated: number[]
        if (prev.includes(num)) {
          updated = prev.filter((n) => n !== num)
        } else {
          if (prev.length >= rule.minNumbers) {
            toast.info(`O sorteio desta loteria possui ${rule.minNumbers} dezenas. Desmarque uma dezena para trocar.`)
            return prev
          }
          updated = [...prev, num].sort((a, b) => a - b)
        }
        setResultInput(updated.join(', '))
        return updated
      })
    },
    [rule.minNumbers]
  )

  const clearResultNumbers = useCallback(() => {
    setResultNumbers([])
    setResultInput('')
  }, [])

  const handleResultInputChange = useCallback((val: string) => {
    setResultInput(val)
    const parsed = parseNumbers(val)
    setResultNumbers(parsed)
  }, [])

  const getMatchedNumbers = useCallback(
    (game: number[]): NumberEntry[] => {
      const effectiveResult = resultNumbers.length > 0 ? resultNumbers : parseNumbers(resultInput)
      const resultSet = new Set(effectiveResult)
      return game.map((n) => ({ number: n, matched: resultSet.has(n) }))
    },
    [resultNumbers, resultInput]
  )

  const getHitsCount = useCallback(
    (game: number[]): number => {
      const effectiveResult = resultNumbers.length > 0 ? resultNumbers : parseNumbers(resultInput)
      const resultSet = new Set(effectiveResult)
      return game.filter((n) => resultSet.has(n)).length
    },
    [resultNumbers, resultInput]
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
    resultNumbers,
    isSavingGames,
    isSavingResult,
    isFetchingCaixaResult,
    setNewGameInput,
    setResultInput: handleResultInputChange,
    setTargetCount,
    setLotteryType,
    toggleNumber,
    toggleResultNumber,
    clearResultNumbers,
    handleFetchCaixaResult,
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