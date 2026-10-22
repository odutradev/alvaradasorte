import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

import { setSweepstakeGames, setSweepstakeResult } from '@services/sweepstakes'
import { allocateGamesByBudget, generateRandomGame } from '@utils/gameAllocation'
import { getLotteryRule, getGamePrice } from '@utils/lotteryRules'
import { getLotteryByType } from '@services/lotteries'
import { parseNumbers } from '../../../utils/games'
import useAction from '@hooks/useAction'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { UseGamesModalReturn, QueuedGame } from './types'
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

  // Inicializa estado quando abre o modal
  useEffect(() => {
    if (!open) return
    const initialType = sweepstake.lotteryType || 'megasena'
    setLotteryType(initialType)

    // Converte jogos existentes salvos para o formato de QueuedGame
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

  // Custo total baseado no targetCount de cada jogo da fila
  const totalCurrentCost = useMemo(() => {
    return Number(
      queuedGames.reduce((acc, g) => acc + getGamePrice(lotteryType, g.targetCount), 0).toFixed(2)
    )
  }, [queuedGames, lotteryType])

  const balance = Number((availableBudget - totalCurrentCost).toFixed(2))

  // Sugestão baseada no orçamento arrecadado
  const allocationSuggestion = useMemo(() => {
    return allocateGamesByBudget(lotteryType, availableBudget)
  }, [lotteryType, availableBudget])

  const activeGame = useMemo(() => {
    if (!activeGameId) return null
    return queuedGames.find((g) => g.id === activeGameId) || null
  }, [queuedGames, activeGameId])

  // Alterna número no jogo atualmente ativo
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

        // Se completou este jogo, busca o próximo jogo incompleto da fila e foca nele automaticamente
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

  // Aplica a sugestão criando a fila de jogos vazios para preenchimento
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

  // Adiciona manualmente um jogo vazio de tamanho específico
  const addEmptyGameToQueue = useCallback((targetCount: number) => {
    const newGame: QueuedGame = {
      id: `manual-${Date.now()}`,
      targetCount,
      numbers: []
    }
    setQueuedGames((prev) => [...prev, newGame])
    setActiveGameId(newGame.id)
  }, [])

  // Gera surpresinha para o jogo ativo
  const generateSurpresinhaForActive = useCallback(() => {
    if (!activeGameId) return
    setQueuedGames((prev) => {
      const gameIndex = prev.findIndex((g) => g.id === activeGameId)
      if (gameIndex === -1) return prev
      const target = prev[gameIndex]
      const random = generateRandomGame(lotteryType, target.targetCount)
      const newQueue = [...prev]
      newQueue[gameIndex] = { ...target, numbers: random }
      return newQueue
    })
  }, [activeGameId, lotteryType])

  // Gera surpresinha para um jogo específico
  const generateSurpresinhaForGame = useCallback(
    (gameId: string) => {
      setQueuedGames((prev) => {
        const gameIndex = prev.findIndex((g) => g.id === gameId)
        if (gameIndex === -1) return prev
        const target = prev[gameIndex]
        const random = generateRandomGame(lotteryType, target.targetCount)
        const newQueue = [...prev]
        newQueue[gameIndex] = { ...target, numbers: random }
        return newQueue
      })
    },
    [lotteryType]
  )

  // Preenche todos os jogos pendentes da fila com surpresinha
  const fillAllPendingWithSurpresinha = useCallback(() => {
    setQueuedGames((prev) =>
      prev.map((game) => {
        if (game.numbers.length === game.targetCount) return game
        return {
          ...game,
          numbers: generateRandomGame(lotteryType, game.targetCount)
        }
      })
    )
    toast.success('Todos os jogos pendentes foram preenchidos com surpresinha!')
  }, [lotteryType])

  // Limpa o jogo ativo
  const clearActiveGame = useCallback(() => {
    if (!activeGameId) return
    setQueuedGames((prev) =>
      prev.map((g) => (g.id === activeGameId ? { ...g, numbers: [] } : g))
    )
  }, [activeGameId])

  // Limpa um jogo pelo ID
  const clearGameById = useCallback((gameId: string) => {
    setQueuedGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, numbers: [] } : g))
    )
  }, [])

  // Remove um jogo da fila
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

  // Remove todos os jogos da fila
  const clearAllQueuedGames = useCallback(() => {
    setQueuedGames([])
    setActiveGameId(null)
  }, [])

  // Adiciona jogos via digitação de texto
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

  // Salva os jogos no servidor
  const handleSaveGames = useCallback(async () => {
    if (queuedGames.length === 0) {
      toast.warn('Nenhum jogo na lista para salvar.')
      return
    }

    // Verifica se há jogos incompletos na fila
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
          success: 'Jogos do bolão salvos com sucesso!',
          pending: 'Salvando jogos...',
          error: 'Erro ao salvar jogos'
        }
      })
    } finally {
      setIsSavingGames(false)
    }
  }, [sweepstake.id, queuedGames, onUpdate])

  // Salva o resultado do sorteio
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

  // Busca o resultado da Caixa
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