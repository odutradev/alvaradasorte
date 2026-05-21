import type { UseFormRegister, UseFormHandleSubmit, UseFormReset } from 'react-hook-form'

import type { PresetFormData } from '../components/presetFormModal/types'
import type { PresetResponse } from '@services/presets/types'
import type { AuthUser } from '@stores/auth/types'

export interface UsePresetsReturn {
  onSubmit: (data: PresetFormData) => Promise<void>
  register: UseFormRegister<PresetFormData>
  handleSubmit: UseFormHandleSubmit<PresetFormData>
  handleDelete: (id: string) => Promise<void>
  reset: UseFormReset<PresetFormData>
  setModalOpen: (open: boolean) => void
  loadPresets: () => Promise<void>
  presets: PresetResponse[]
  logout: () => Promise<void>
  user: AuthUser | null
  modalOpen: boolean
}