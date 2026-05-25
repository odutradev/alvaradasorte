export interface ProfileFormData {
  department: string
  fullName: string
  phone: string
}

export interface CompleteProfileModalProps {
  isProfileIncomplete: boolean
  onClose: () => void
  open: boolean
}
