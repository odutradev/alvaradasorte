import type { ExtendedParticipation } from '../types'

export interface UseParticipantsTableProps {
  participations: ExtendedParticipation[]
  sweepstakeId?: string
  onUpdate?: () => void
}
