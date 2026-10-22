import type { AuthFormData, LoginMode } from '../../hook/types'

export interface LoginCardProps {
  onEmailSubmit: (data: AuthFormData) => Promise<void>
  onGoogleLogin: () => Promise<void>
  onToggleMode: () => void
  mode: LoginMode
}
