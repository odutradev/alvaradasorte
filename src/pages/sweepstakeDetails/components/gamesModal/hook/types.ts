import type { GameAllocationResult } from '@utils/gameAllocation'
import type { LotteryRule } from '@utils/lotteryRules'
import type { NumberEntry } from '../types'

export interface UseGamesModalReturn {
  games: number[][]
  selectedNumbers: number[]
  targetCount: number
  lotteryType: string
  rule: LotteryRule
  availableBudget: number
  totalCurrentCost: number
  balance: number
  allocationSuggestion: GameAllocationResult
  newGameInput: string
  resultInput: string
  resultNumbers: number[]
  isSavingGames: boolean
  isSavingResult: boolean
  isFetchingCaixaResult: boolean
  setNewGameInput: (v: string) => void
  setResultInput: (v: string) => void
  setTargetCount: (count: number) => void
  setLotteryType: (type: string) => void
  toggleNumber: (n: number) => void
  toggleResultNumber: (n: number) => void
  clearResultNumbers: () => void
  handleFetchCaixaResult: () => Promise<void>
  generateSurpresinha: () => void
  clearSelectedNumbers: () => void
  addCurrentGame: () => boolean
  addGameFromInput: () => void
  removeGame: (index: number) => void
  clearAllGames: () => void
  applySuggestion: () => void
  handleSaveGames: () => Promise<void>
  handleSaveResult: () => Promise<void>
  getMatchedNumbers: (game: number[]) => NumberEntry[]
  getHitsCount: (game: number[]) => number
}