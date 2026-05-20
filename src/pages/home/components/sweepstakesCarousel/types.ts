import type { SweepstakeResponse } from '@services/sweepstakes/types'

export interface SweepstakesCarouselProps {
  onJoin: (id: string) => void
  sweepstakes: SweepstakeResponse[]
}
