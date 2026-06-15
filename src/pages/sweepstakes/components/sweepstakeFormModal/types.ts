import type { CreateSweepstakeRequest, SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakeFormModalProps {
  initialData?: SweepstakeResponse | null
  onSuccess: () => void
  onClose: () => void
  open: boolean
}

export type SweepstakeFormData = Omit<CreateSweepstakeRequest, 'availableQuotas' | 'prizeValue' | 'quotaPrice'> & {
  availableQuotas: number
  prizeValue: string
  quotaPrice: number
}