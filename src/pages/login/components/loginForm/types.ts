export interface AuthFormData {
  password: string
  email: string
  name?: string
}

export interface LoginFormProps {
  onToggleMode: () => void
  isRegister: boolean
}