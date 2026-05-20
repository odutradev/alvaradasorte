export interface SweepstakeResponse {
  purchaseLimitDate: string
  availableQuotas: number
  prizeValue: number
  quotaPrice: number
  createdAt: string
  updatedAt: string
  presetId: string
  drawDate: string
  adminId: string
  title: string
  id: string
}

export type ListSweepstakesResponse = SweepstakeResponse[]

export interface CreateSweepstakeRequest {
  purchaseLimitDate: string
  availableQuotas: number
  prizeValue: number
  quotaPrice: number
  presetId: string
  drawDate: string
  title: string
}

export interface ParticipationResponse {
  sweepstakeId: string
  receiptUrl: string
  createdAt: string
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