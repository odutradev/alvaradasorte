export type ResultSyncAttempt = {
  attemptNumber: number
  timestamp: string
  success: boolean
  message?: string
  drawnNumbers?: number[]
}

export type ResultSyncLog = {
  status: 'pending' | 'success' | 'failed'
  attemptsCount: number
  maxAttempts: number
  lastAttemptAt?: string
  nextAttemptAt?: string
  successAt?: string
  attempts: ResultSyncAttempt[]
}

export type SweepstakeType = {
  id: string
  adminId: string
  title: string
  description: string
  quotaPrice: number
  prizeValue: number
  availableQuotas: number
  drawDate: string
  purchaseLimitDate: string
  presetId: string
  games?: number[][]
  result?: number[]
  contestNumber?: number
  lotteryType?: string
  resultSyncLog?: ResultSyncLog
  createdAt: string
  updatedAt: string
}

export type CreateSweepstakePayload = Omit<SweepstakeType, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateSweepstakePayload = Partial<Omit<SweepstakeType, 'id' | 'createdAt' | 'updatedAt' | 'adminId'>>

