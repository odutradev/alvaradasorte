import type { ReactNode } from 'react'

export interface ConfirmationModalProps {
  confirmColor?: 'inherit' | 'secondary' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  cancelColor?: 'inherit' | 'secondary' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  description: ReactNode
  onCancel: () => void
  title: string
  open: boolean
}