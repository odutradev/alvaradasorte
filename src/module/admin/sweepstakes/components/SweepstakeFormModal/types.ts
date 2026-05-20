import type { CreateSweepstakeRequest } from '@core/services/sweepstakes/types'

export interface SweepstakeFormModalProps {
  onSuccess: () => void
  onClose: () => void
  open: boolean
}

export type SweepstakeFormData = Omit<CreateSweepstakeRequest, 'availableQuotas' | 'prizeValue' | 'quotaPrice'> & {
  availableQuotas: string
  prizeValue: string
  quotaPrice: string
}