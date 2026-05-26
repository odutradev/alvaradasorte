import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import type { PresetFormData } from '../../hook/types'

export interface PresetFormModalProps {
  handleSubmit: UseFormHandleSubmit<PresetFormData>
  register: UseFormRegister<PresetFormData>
  onSubmit: (data: PresetFormData) => Promise<void>
  onClose: () => void
  open: boolean
}
