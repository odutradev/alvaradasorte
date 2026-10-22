export type ParticipationType = {
  id: string
  sweepstakeId: string
  userId: string
  userName: string
  userPhone: string
  userDepartment: string
  userPhotoUrl?: string
  receiptUrl: string
  quotaCount: number
  suggestedNumbers?: number[]
  resultEmailSent?: boolean
  resultEmailSentAt?: string
  createdAt: string
}

export type CreateParticipationPayload = Omit<ParticipationType, 'id' | 'createdAt'> & {
  quotaCount?: number
  suggestedNumbers?: number[]
}

export type UpdateParticipationPayload = Partial<Omit<ParticipationType, 'id' | 'createdAt' | 'sweepstakeId' | 'userId'>>

