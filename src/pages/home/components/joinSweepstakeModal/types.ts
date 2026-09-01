import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface JoinFormData {
  receipt: FileList
  quotaCount: number
}

export interface JoinSweepstakeModalProps {
  sweepstake?: SweepstakeResponse | null
  onSuccess: () => void
  sweepstakeId: string
  onClose: () => void
  open: boolean
}