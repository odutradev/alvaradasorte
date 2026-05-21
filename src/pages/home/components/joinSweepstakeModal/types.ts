import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface JoinFormData {
  receipt: FileList
}

export interface JoinSweepstakeModalProps {
  onSuccess: () => void
  sweepstake: SweepstakeResponse | null
  onClose: () => void
  open: boolean
}