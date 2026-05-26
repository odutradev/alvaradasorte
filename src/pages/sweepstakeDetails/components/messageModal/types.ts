import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export interface MessageModalProps {
  open: boolean
  onClose: () => void
  data: SweepstakeResponse
  preset: PresetResponse | null
}