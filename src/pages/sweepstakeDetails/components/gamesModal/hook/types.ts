import type { GameAllocationResult } from '@utils/gameAllocation'
import type { LotteryRule } from '@utils/lotteryRules'
import type { NumberEntry } from '../types'

export interface QueuedGame {
  id: string
  targetCount: number
  numbers: number[]
}

export interface UseGamesModalReturn {
  queuedGames: QueuedGame[]
  activeGameId: string | null
  activeGame: QueuedGame | null
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
  setActiveGameId: (id: string | null) => void
  setNewGameInput: (v: string) => void
  setResultInput: (v: string) => void
  setLotteryType: (type: string) => void
  toggleNumber: (n: number) => void
  toggleResultNumber: (n: number) => void
  clearResultNumbers: () => void
  handleFetchCaixaResult: () => Promise<void>
  generateSurpresinhaForActive: () => void
  generateSurpresinhaForGame: (gameId: string) => void
  fillAllPendingWithSurpresinha: () => void
  clearActiveGame: () => void
  clearGameById: (gameId: string) => void
  addEmptyGameToQueue: (targetCount: number) => void
  addGameFromInput: () => void
  removeGameFromQueue: (gameId: string) => void
  clearAllQueuedGames: () => void
  applySuggestionAsQueue: () => void
  handleSaveGames: () => Promise<void>
  handleSaveResult: () => Promise<void>
  getMatchedNumbers: (numbers: number[]) => NumberEntry[]
  getHitsCount: (numbers: number[]) => number
}