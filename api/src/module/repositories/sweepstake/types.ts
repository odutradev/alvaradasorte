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
  createdAt: string
  updatedAt: string
}

export type CreateSweepstakePayload = Omit<SweepstakeType, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateSweepstakePayload = Partial<Omit<SweepstakeType, 'id' | 'createdAt' | 'updatedAt' | 'adminId'>>
