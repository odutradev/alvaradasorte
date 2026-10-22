import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakeCardProps {
  onJoin: (id: string) => void
  data: SweepstakeResponse
}