import type { AuthFormData, LoginMode } from '../../hook/types'

export interface LoginFormProps {
  onSubmit: (data: AuthFormData) => Promise<void>
  mode: LoginMode
}
