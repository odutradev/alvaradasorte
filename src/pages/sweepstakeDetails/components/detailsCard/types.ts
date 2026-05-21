import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export interface DetailsCardProps {
  data: SweepstakeDetailsResponse
  preset: PresetResponse | null
}