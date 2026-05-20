import type { AuthFormData } from '../../hook/types'

export interface LoginFormProps {
  onSubmit: (data: AuthFormData) => Promise<void>
}