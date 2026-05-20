import type { CreatePresetRequest } from '@core/services/presets/types'

export interface PresetFormModalProps {
  onSuccess: () => void
  onClose: () => void
  open: boolean
}

export type PresetFormData = CreatePresetRequest