import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

import { setSweepstakeGames, setSweepstakeResult } from '@services/sweepstakes'
import { allocateGamesByBudget, generateRandomGame } from '@utils/gameAllocation'
import { getLotteryRule, getGamePrice } from '@utils/lotteryRules'
import { getLotteryByType } from '@services/lotteries'
import { parseNumbers } from '../../../utils/games'
import useAction from '@hooks/useAction'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { UseGamesModalReturn, QueuedGame, SuggestedNumberItem } from './types'
import type { NumberEntry } from '../types'

const useGamesModal = (
  sweepstake: SweepstakeDetailsResponse,
  open: boolean,
  onUpdate: () => Promise<void>
): UseGamesModalReturn => {
  const [lotteryType, setLotteryType] = useState<string>(sweepstake.lotteryType || 'megasena')
  const [queuedGames, setQueuedGames] = useState<QueuedGame[]>([])
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const [newGameInput, setNewGameInput] = useState('')
  const [resultNumbers, setResultNumbers] = useState<number[]>(sweepstake.result ?? [])
  const [resultInput, setResultInput] = useState((sweepstake.result ?? []).join(', '))
  const [isSavingGames, setIsSavingGames] = useState(false)
  const [isSavingResult, setIsSavingResult] = useState(false)
  const [isFetchingCaixaResult, setIsFetchingCaixaResult] = useState(false)

  const rule = useMemo(() => getLotteryRule(lotteryType), [lotteryType])

  useEffect(() => {
    if (!open) return
    const initialType = sweepstake.lotteryType || 'megasena'
    setLotteryType(initialType)

    const initialGames: QueuedGame[] = (sweepstake.games ?? []).map((numbers, idx) => ({
      id: `saved-${idx}-${Date.now()}`,
      targetCount: numbers.length,
      numbers: [...numbers].sort((a, b) => a - b)
    }))

    setQueuedGames(initialGames)
    setActiveGameId(initialGames.length > 0 ? initialGames[0].id : null)

    const initialResult = sweepstake.result ?? []
    setResultNumbers(initialResult)
    setResultInput(initialResult.join(', '))
    setNewGameInput('')
  }, [open, sweepstake])

  const filledQuotas = sweepstake.participations?.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0) ?? 0
  const availableBudget = Number((filledQuotas * sweepstake.quotaPrice).toFixed(2))

  const totalCurrentCost = useMemo(() => {
    return Number(
      queuedGames.reduce((acc, g) => acc + getGamePrice(lotteryType, g.targetCount), 0).toFixed(2)
    )
  }, [queuedGames, lotteryType])

  const balance = Number((availableBudget - totalCurrentCost).toFixed(2))

  const allocationSuggestion = useMemo(() => {
    return allocateGamesByBudget(lotteryType, availableBudget)
  }, [lotteryType, availableBudget])

  const activeGame = useMemo(() => {
    if (!activeGameId) return null
    return queuedGames.find((g) => g.id === activeGameId) || null
  }, [queuedGames, activeGameId])

  const suggestedNumbersList = useMemo<SuggestedNumberItem[]>(() => {
    const map = new Map<number, { participants: Set<string>; usedCount: number }>()

    for (const p of sweepstake.participations ?? []) {
      const numbers = p.suggestedNumbers ?? []
      for (const num of numbers) {
        if (!map.has(num)) {
          map.set(num, { participants: new Set(), usedCount: 0 })
        }
        map.get(num)!.participants.add(p.userName || 'Participante')
      }
    }

    for (const game of queuedGames) {
      for (const num of game.numbers) {
        if (map.has(num)) {
          map.get(num)!.usedCount += 1
        }
      }
    }

    const items: SuggestedNumberItem[] = []
    map.forEach((data, number) => {
      items.push({
        number,
        participants: Array.from(data.participants),
        isUsed: data.usedCount > 0,
        usedCount: data.usedCount
      })
    })

    return items.sort((a, b) => a.number - b.number)
  }, [sweepstake.participations, queuedGames])

  const totalSuggestedCount = suggestedNumbersList.length
  const usedSuggestedCount = useMemo(
    () => suggestedNumbersList.filter((s) => s.isUsed).length,
    [suggestedNumbersList]
  )
  const pendingSuggestedCount = totalSuggestedCount - usedSuggestedCount

  const toggleNumber = useCallback(
    (num: number) => {
      if (!activeGameId) {
        toast.info('Selecione um jogo na fila para preencher ou crie um novo jogo.')
        return
      }

      setQueuedGames((prev) => {
        const gameIndex = prev.findIndex((g) => g.id === activeGameId)
        if (gameIndex === -1) return prev

        const target = prev[gameIndex]
        let updatedNumbers: number[]

        if (target.numbers.includes(num)) {
          updatedNumbers = target.numbers.filter((n) => n !== num)
        } else {
          if (target.numbers.length >= target.targetCount) {
            toast.warn(`Este jogo já atingiu o limite de ${target.targetCount} dezenas.`)
            return prev
          }
          updatedNumbers = [...target.numbers, num].sort((a, b) => a - b)
        }

        const updatedGame = { ...target, numbers: updatedNumbers }
        const newQueue = [...prev]
        newQueue[gameIndex] = updatedGame

        if (updatedNumbers.length === target.targetCount) {
          const nextPending = newQueue.find((g) => g.id !== activeGameId && g.numbers.length < g.targetCount)
          if (nextPending) {
            setTimeout(() => {
              setActiveGameId(nextPending.id)
            }, 150)
          }
        }

        return newQueue
      })
    },
    [activeGameId]
  )

  const applySuggestionAsQueue = useCallback(() => {
    if (allocationSuggestion.allocations.length === 0) {
      toast.warn('Nenhuma sugestão disponível para o valor atual.')
      return
    }

    const newEmptyGames: QueuedGame[] = []
    let counter = 1

    for (const item of allocationSuggestion.allocations) {
      for (let i = 0; i < item.count; i++) {
        newEmptyGames.push({
          id: `suggested-${Date.now()}-${counter++}`,
          targetCount: item.numbersCount,
          numbers: []
        })
      }
    }

    setQueuedGames(newEmptyGames)
    if (newEmptyGames.length > 0) {
      setActiveGameId(newEmptyGames[0].id)
      toast.success(
        `Fila de preenchimento criada com ${newEmptyGames.length} jogo(s) vazios! Preencha as dezenas no volante.`
      )
    }
  }, [allocationSuggestion])

  const addEmptyGameToQueue = useCallback((targetCount: number) => {
    const newGame: QueuedGame = {
      id: `manual-${Date.now()}`,
      targetCount,
      numbers: []
    }
    setQueuedGames((prev) => [...prev, newGame])
    setActiveGameId(newGame.id)
  }, [])

  const fillRemainingWithRandom = useCallback(
    (currentNumbers: number[], targetCount: number, maxNumber: number): number[] => {
      const selected = new Set<number>(currentNumbers)
      let attempts = 0
      while (selected.size < targetCount && attempts < 2000) {
        attempts++
        const rand = Math.floor(Math.random() * maxNumber) + 1
        selected.add(rand)
      }
      return Array.from(selected).sort((a, b) => a - b)
    },
    []
  )

  const generateSurpresinhaForActive = useCallback(() => {
    if (!activeGameId) return
    setQueuedGames((prev) => {
      const gameIndex = prev.findIndex((g) => g.id === activeGameId)
      if (gameIndex === -1) return prev
      const target = prev[gameIndex]
      const current = target.numbers
      const finalNumbers =
        current.length > 0 && current.length < target.targetCount
          ? fillRemainingWithRandom(current, target.targetCount, rule.totalNumbers)
          : generateRandomGame(lotteryType, target.targetCount)
      const newQueue = [...prev]
      newQueue[gameIndex] = { ...target, numbers: finalNumbers }
      return newQueue
    })
  }, [activeGameId, lotteryType, fillRemainingWithRandom, rule.totalNumbers])

  const generateSurpresinhaForGame = useCallback(
    (gameId: string) => {
      setQueuedGames((prev) => {
        const gameIndex = prev.findIndex((g) => g.id === gameId)
        if (gameIndex === -1) return prev
        const target = prev[gameIndex]
        const current = target.numbers
        const finalNumbers =
          current.length > 0 && current.length < target.targetCount
            ? fillRemainingWithRandom(current, target.targetCount, rule.totalNumbers)
            : generateRandomGame(lotteryType, target.targetCount)
        const newQueue = [...prev]
        newQueue[gameIndex] = { ...target, numbers: finalNumbers }
        return newQueue
      })
    },
    [lotteryType, fillRemainingWithRandom, rule.totalNumbers]
  )

  const fillAllPendingWithSurpresinha = useCallback(() => {
    setQueuedGames((prev) =>
      prev.map((game) => {
        if (game.numbers.length === game.targetCount) return game
        const current = game.numbers
        const finalNumbers =
          current.length > 0 && current.length < game.targetCount
            ? fillRemainingWithRandom(current, game.targetCount, rule.totalNumbers)
            : generateRandomGame(lotteryType, game.targetCount)
        return {
          ...game,
          numbers: finalNumbers
        }
      })
    )
    toast.success('Todos os jogos pendentes foram completados com surpresinha!')
  }, [lotteryType, fillRemainingWithRandom, rule.totalNumbers])

  const fillGameWithSuggested = useCallback(
    (gameId: string) => {
      const gameIndex = queuedGames.findIndex((g) => g.id === gameId)
      if (gameIndex === -1) return

      const target = queuedGames[gameIndex]
      if (target.numbers.length >= target.targetCount) {
        toast.info('Este jogo já está completo.')
        return
      }

      const unusedSuggested = suggestedNumbersList
        .filter((s) => !s.isUsed && !target.numbers.includes(s.number))
        .map((s) => s.number)

      const fallbackSuggested = suggestedNumbersList
        .filter((s) => !target.numbers.includes(s.number))
        .map((s) => s.number)

      const candidates = unusedSuggested.length > 0 ? unusedSuggested : fallbackSuggested

      if (candidates.length === 0) {
        toast.info('Não há números indicados disponíveis para este jogo. Use a surpresinha para preencher.')
        return
      }

      const neededSlots = target.targetCount - target.numbers.length
      const toAdd = candidates.slice(0, neededSlots)
      const finalNumbers = [...target.numbers, ...toAdd].sort((a, b) => a - b)

      setQueuedGames((prev) => {
        const next = [...prev]
        next[gameIndex] = { ...target, numbers: finalNumbers }
        return next
      })

      if (finalNumbers.length < target.targetCount) {
        toast.success(
          `Adicionada(s) ${toAdd.length} dezena(s) indicada(s)! Faltam ${target.targetCount - finalNumbers.length} dezena(s) — clique na surpresinha para terminar de preencher.`
        )
      } else {
        toast.success(`Jogo preenchido com ${toAdd.length} dezena(s) indicada(s)!`)
      }
    },
    [queuedGames, suggestedNumbersList]
  )

  const fillActiveGameWithSuggested = useCallback(() => {
    if (!activeGameId) {
      toast.info('Selecione um jogo na fila para preencher com os números indicados.')
      return
    }
    fillGameWithSuggested(activeGameId)
  }, [activeGameId, fillGameWithSuggested])

  const fillAllPendingWithSuggested = useCallback(() => {
    const hasPending = queuedGames.some((g) => g.numbers.length < g.targetCount)
    if (!hasPending) {
      toast.info('Não há jogos pendentes na fila.')
      return
    }

    let availablePool = suggestedNumbersList.filter((s) => !s.isUsed).map((s) => s.number)

    if (availablePool.length === 0) {
      toast.info('Não há números indicados livres disponíveis. Use a surpresinha para preencher.')
      return
    }

    let usedCountTotal = 0

    const updated = queuedGames.map((game) => {
      if (game.numbers.length >= game.targetCount) return game
      if (availablePool.length === 0) return game

      const current = [...game.numbers]
      const needed = game.targetCount - current.length

      const fromPool: number[] = []
      for (const num of availablePool) {
        if (!current.includes(num)) {
          fromPool.push(num)
          if (fromPool.length >= needed) break
        }
      }

      if (fromPool.length > 0) {
        availablePool = availablePool.filter((n) => !fromPool.includes(n))
        usedCountTotal += fromPool.length
      }

      const finalNumbers = [...current, ...fromPool].sort((a, b) => a - b)

      return {
        ...game,
        numbers: finalNumbers
      }
    })

    setQueuedGames(updated)

    const remainingEmptySlots = updated.reduce(
      (acc, g) => acc + (g.targetCount - g.numbers.length),
      0
    )

    if (usedCountTotal > 0) {
      if (remainingEmptySlots > 0) {
        toast.success(
          `${usedCountTotal} dezena(s) indicada(s) distribuída(s)! Use a surpresinha nos jogos com vagas para terminar de preencher.`
        )
      } else {
        toast.success(`Jogos pendentes preenchidos com ${usedCountTotal} dezena(s) indicada(s)!`)
      }
    } else {
      toast.info('Nenhuma dezena indicada pôde ser adicionada.')
    }
  }, [queuedGames, suggestedNumbersList])

  const clearActiveGame = useCallback(() => {
    if (!activeGameId) return
    setQueuedGames((prev) =>
      prev.map((g) => (g.id === activeGameId ? { ...g, numbers: [] } : g))
    )
  }, [activeGameId])

  const clearGameById = useCallback((gameId: string) => {
    setQueuedGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, numbers: [] } : g))
    )
  }, [])

  const removeGameFromQueue = useCallback(
    (gameId: string) => {
      setQueuedGames((prev) => {
        const remaining = prev.filter((g) => g.id !== gameId)
        if (activeGameId === gameId) {
          setActiveGameId(remaining.length > 0 ? remaining[0].id : null)
        }
        return remaining
      })
    },
    [activeGameId]
  )

  const clearAllQueuedGames = useCallback(() => {
    setQueuedGames([])
    setActiveGameId(null)
  }, [])

  const addGameFromInput = useCallback(() => {
    if (!newGameInput.trim()) return

    const lines = newGameInput.split('\n').map((l) => l.trim()).filter(Boolean)
    const newGamesToAdd: QueuedGame[] = []

    for (const line of lines) {
      const numbers = parseNumbers(line)
      if (numbers.length >= rule.minNumbers) {
        const unique = Array.from(new Set(numbers.filter((n) => n <= rule.totalNumbers))).sort((a, b) => a - b)
        if (unique.length >= rule.minNumbers) {
          newGamesToAdd.push({
            id: `text-${Date.now()}-${Math.random()}`,
            targetCount: unique.length,
            numbers: unique
          })
        }
      }
    }

    if (newGamesToAdd.length > 0) {
      setQueuedGames((prev) => [...prev, ...newGamesToAdd])
      setNewGameInput('')
      toast.success(`${newGamesToAdd.length} jogo(s) adicionados!`)
    }
  }, [newGameInput, rule.minNumbers, rule.totalNumbers])

  const handleSaveGames = useCallback(async () => {
    const incomplete = queuedGames.filter((g) => g.numbers.length < g.targetCount)
    if (incomplete.length > 0) {
      toast.warn(
        `Existem ${incomplete.length} jogo(s) incompletos na fila. Preencha todas as dezenas ou exclua-os antes de salvar.`
      )
      return
    }

    setIsSavingGames(true)
    try {
      const gamesArray = queuedGames.map((g) => g.numbers)
      await useAction({
        action: () => setSweepstakeGames(sweepstake.id, { games: gamesArray }),
        callback: () => onUpdate(),
        toastMessages: {
          success: gamesArray.length > 0 ? 'Jogos do bolão salvos com sucesso!' : 'Jogos do bolão removidos com sucesso!',
          pending: 'Salvando jogos...',
          error: 'Erro ao salvar jogos'
        }
      })
    } finally {
      setIsSavingGames(false)
    }
  }, [sweepstake.id, queuedGames, onUpdate])

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
    } catch (error: any) {
      const errorDetails = error?.response?.data?.details || error?.response?.data?.message
      toast.error(errorDetails ? `Caixa: ${errorDetails}` : 'Não foi possível obter o resultado da Caixa Econômica.')
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

  const getMatchedNumbers = useCallback(
    (numbers: number[]): NumberEntry[] => {
      const effectiveResult = resultNumbers.length > 0 ? resultNumbers : parseNumbers(resultInput)
      return numbers.map((num) => ({
        number: num,
        matched: effectiveResult.includes(num)
      }))
    },
    [resultNumbers, resultInput]
  )

  const getHitsCount = useCallback(
    (numbers: number[]): number => {
      const effectiveResult = resultNumbers.length > 0 ? resultNumbers : parseNumbers(resultInput)
      if (!effectiveResult.length) return 0
      return numbers.filter((num) => effectiveResult.includes(num)).length
    },
    [resultNumbers, resultInput]
  )

  return {
    queuedGames,
    activeGameId,
    activeGame,
    lotteryType,
    rule,
    availableBudget,
    totalCurrentCost,
    balance,
    allocationSuggestion,
    newGameInput,
    resultInput,
    resultNumbers,
    suggestedNumbersList,
    totalSuggestedCount,
    usedSuggestedCount,
    pendingSuggestedCount,
    isSavingGames,
    isSavingResult,
    isFetchingCaixaResult,
    setActiveGameId,
    setNewGameInput,
    setResultInput,
    setLotteryType,
    toggleNumber,
    toggleResultNumber,
    clearResultNumbers,
    handleFetchCaixaResult,
    generateSurpresinhaForActive,
    generateSurpresinhaForGame,
    fillAllPendingWithSurpresinha,
    fillGameWithSuggested,
    fillActiveGameWithSuggested,
    fillAllPendingWithSuggested,
    clearActiveGame,
    clearGameById,
    addEmptyGameToQueue,
    addGameFromInput,
    removeGameFromQueue,
    clearAllQueuedGames,
    applySuggestionAsQueue,
    handleSaveGames,
    handleSaveResult,
    getMatchedNumbers,
    getHitsCount
  }
}

export default useGamesModal