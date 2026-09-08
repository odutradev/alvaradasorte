import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export interface EditFormProps {
  data: SweepstakeDetailsResponse
  presets: PresetResponse[]
  onSuccess: () => Promise<void>
  onCancel: () => void
}

export interface SweepstakeEditFormData {
  title: string
  description: string
  quotaPrice: number
  prizeValue: string
  availableQuotas: number
  drawDate: string
  purchaseLimitDate: string
  presetId: string
}
