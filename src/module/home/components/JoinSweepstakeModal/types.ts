export interface JoinFormData {
  receiptUrl: string
}

export interface JoinSweepstakeModalProps {
  onSuccess: () => void
  sweepstakeId: string
  onClose: () => void
  open: boolean
}