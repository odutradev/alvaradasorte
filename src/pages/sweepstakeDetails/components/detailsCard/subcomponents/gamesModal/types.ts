import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'

export interface GamesModalProps {
  sweepstake: SweepstakeDetailsResponse
  onUpdate: () => void
  onClose: () => void
  open: boolean
}

export interface NumberEntry {
  number: number
  matched: boolean
}
