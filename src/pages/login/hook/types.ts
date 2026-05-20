export interface AuthFormData {
  password: string
  email: string
}

export interface UseLoginReturn {
  handleEmailLogin: (data: AuthFormData) => Promise<void>
  handleGoogleLogin: () => Promise<void>
  handleAppleLogin: () => Promise<void>
  isAuthenticated: boolean
}