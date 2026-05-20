import type { SweepstakeResponse } from '@core/services/sweepstakes/types'

export interface SweepstakeCardProps {
  onJoin: (id: string) => void
  data: SweepstakeResponse
}