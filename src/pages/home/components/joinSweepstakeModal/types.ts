export interface JoinFormData {
  receipt: FileList
}

export interface JoinSweepstakeModalProps {
  onSuccess: () => void
  sweepstakeId: string
  onClose: () => void
  open: boolean
}