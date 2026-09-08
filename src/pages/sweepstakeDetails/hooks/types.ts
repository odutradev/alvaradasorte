import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export interface UseSweepstakeDetailsReturn {
  details: SweepstakeDetailsResponse | null
  preset: PresetResponse | null
  presets: PresetResponse[]
  fetchDetails: () => Promise<void>
  isLoading: boolean
}