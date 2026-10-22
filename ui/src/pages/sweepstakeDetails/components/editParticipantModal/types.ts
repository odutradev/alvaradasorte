import type { ExtendedParticipation } from '../participantsTable/types'

export interface EditParticipantModalProps {
  participation: ExtendedParticipation | null
  sweepstakeId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}
