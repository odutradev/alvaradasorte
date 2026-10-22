import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakeCardProps {
  onDelete: (sweepstake: SweepstakeResponse) => void
  onEdit: (sweepstake: SweepstakeResponse) => void
  sweepstake: SweepstakeResponse
  onViewDetails: (id: string) => void
}