import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import type { CreatePresetRequest, PresetResponse } from '@services/presets/types'
import type { AuthUser } from '@stores/auth/types'

export type PresetFormData = CreatePresetRequest

export interface UsePresetsReturn {
  handleSubmit: UseFormHandleSubmit<PresetFormData>
  register: UseFormRegister<PresetFormData>
  onSubmit: (data: PresetFormData) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  handleEdit: (preset: PresetResponse) => void
  setModalOpen: (open: boolean) => void
  editingPreset: PresetResponse | null
  presets: PresetResponse[]
  user: AuthUser | null
  modalOpen: boolean
}
