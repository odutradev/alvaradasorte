import type { NumberEntry } from '../types'

export interface UseGamesModalReturn {
  games: number[][]
  newGameInput: string
  resultInput: string
  setNewGameInput: (v: string) => void
  setResultInput: (v: string) => void
  addGame: () => void
  removeGame: (i: number) => void
  handleSaveGames: () => Promise<void>
  handleSaveResult: () => Promise<void>
  getMatchedNumbers: (g: number[]) => NumberEntry[]
}