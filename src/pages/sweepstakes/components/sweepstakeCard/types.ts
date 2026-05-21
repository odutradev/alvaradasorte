import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakeCardProps {
  sweepstake: SweepstakeResponse
  onViewDetails: (id: string) => void
}