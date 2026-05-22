import { useState, useCallback, useEffect } from 'react'

import { setSweepstakeGames, setSweepstakeResult } from '@services/sweepstakes'
import useAction from '@hooks/useAction'

import type { NumberEntry } from './types'

const parseNumbers = (input: string): number[] =>
  input.split(/[,\s]+/).filter(Boolean).map(Number).filter((n) => !isNaN(n) && n > 0)

export const useGamesModal = (
  id: string,
  initialGames: number[][],
  initialResult: number[],
  open: boolean,
  onUpdate: () => void
) => {
  const [games, setGames] = useState<number[][]>(initialGames)
  const [newGameInput, setNewGameInput] = useState('')
  const [resultInput, setResultInput] = useState(initialResult.join(', '))

  useEffect(() => {
    if (!open) return
    setGames(initialGames)
    setResultInput(initialResult.join(', '))
    setNewGameInput('')
  }, [open])

  const addGame = useCallback(() => {
    const numbers = parseNumbers(newGameInput)
    if (!numbers.length) return
    setGames((prev) => [...prev, numbers])
    setNewGameInput('')
  }, [newGameInput])

  const removeGame = useCallback((index: number) => {
    setGames((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSaveGames = useCallback(async () => {
    await useAction({
      action: () => setSweepstakeGames(id, { games }),
      callback: () => onUpdate()
    })
  }, [id, games, onUpdate])

  const handleSaveResult = useCallback(async () => {
    const parsed = parseNumbers(resultInput)
    if (!parsed.length) return
    await useAction({
      action: () => setSweepstakeResult(id, { result: parsed }),
      callback: () => onUpdate()
    })
  }, [id, resultInput, onUpdate])

  const getMatchedNumbers = useCallback((game: number[]): NumberEntry[] => {
    const resultSet = new Set(parseNumbers(resultInput))
    return game.map((n) => ({ number: n, matched: resultSet.has(n) }))
  }, [resultInput])

  return {
    games,
    newGameInput,
    resultInput,
    setNewGameInput,
    setResultInput,
    addGame,
    removeGame,
    handleSaveGames,
    handleSaveResult,
    getMatchedNumbers
  }
}
