export interface AuthFormData {
  confirmPassword?: string
  password: string
  email: string
  name?: string
}

export interface UseLoginReturn {
  handleEmailRegister: (data: AuthFormData) => Promise<void>
  handleEmailLogin: (data: AuthFormData) => Promise<void>
  handleGoogleLogin: () => Promise<void>
  handleAppleLogin: () => Promise<void>
  isAuthenticated: boolean
}