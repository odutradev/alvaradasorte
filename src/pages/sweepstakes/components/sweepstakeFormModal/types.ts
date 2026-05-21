import type { CreateSweepstakeRequest } from '@services/sweepstakes/types'

export interface SweepstakeFormModalProps {
  onSuccess: () => void
  onClose: () => void
  open: boolean
}

export type SweepstakeFormData = Omit<CreateSweepstakeRequest, 'availableQuotas' | 'prizeValue' | 'quotaPrice'> & {
  availableQuotas: number
  prizeValue: string
  quotaPrice: number
}