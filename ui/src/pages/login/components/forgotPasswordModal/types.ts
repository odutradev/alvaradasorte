export interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
  initialEmail?: string
}

export interface ForgotPasswordFormData {
  email: string
}
