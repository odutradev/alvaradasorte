import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakeListProps {
  onDelete: (sweepstake: SweepstakeResponse) => void
  onEdit: (sweepstake: SweepstakeResponse) => void
  onViewDetails: (id: string) => void
  sweepstakes: SweepstakeResponse[]
}