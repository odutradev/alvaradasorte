import type { CreatePresetRequest } from '@services/presets/types'

export interface PresetFormModalProps {
  onSuccess: () => void
  onClose: () => void
  open: boolean
}

export type PresetFormData = CreatePresetRequest