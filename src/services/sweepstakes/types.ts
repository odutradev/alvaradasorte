export interface SweepstakeResponse {
  purchaseLimitDate: string
  availableQuotas: number
  description: string
  prizeValue: number
  quotaPrice: number
  games?: number[][]
  result?: number[]
  createdAt: string
  updatedAt: string
  presetId: string
  drawDate: string
  adminId: string
  title: string
  id: string
  metadata: {
    filledQuotas: number
  }
  userParticipation?: {
    isParticipant: boolean
    joinedAt: string | null
  }
}

export type ListSweepstakesResponse = SweepstakeResponse[]

export interface CreateSweepstakeRequest {
  purchaseLimitDate: string
  availableQuotas: number
  description: string
  prizeValue: number
  quotaPrice: number
  presetId: string
  drawDate: string
  title: string
}

export interface SetGamesRequest {
  games: number[][]
}

export interface SetResultRequest {
  result: number[]
}

export interface ParticipationResponse {
  userDepartment: string
  sweepstakeId: string
  receiptUrl: string
  createdAt: string
  userPhone: string
  userName: string
  userId: string
  id: string
}

export interface SweepstakeDetailsResponse extends SweepstakeResponse {
  participations: ParticipationResponse[]
}

export interface JoinSweepstakeRequest {
  receipt: File
}
