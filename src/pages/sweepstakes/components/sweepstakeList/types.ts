import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakeListProps {
  onViewDetails: (id: string) => void
  sweepstakes: SweepstakeResponse[]
}
