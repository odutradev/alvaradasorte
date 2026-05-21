import type { UseFormRegister, UseFormHandleSubmit } from 'react-hook-form'

import type { CreatePresetRequest } from '@services/presets/types'

export interface PresetFormModalProps {
  register: UseFormRegister<PresetFormData>
  handleSubmit: UseFormHandleSubmit<PresetFormData>
  onSubmit: (data: PresetFormData) => Promise<void>
  onClose: () => void
  open: boolean
}

export type PresetFormData = CreatePresetRequest