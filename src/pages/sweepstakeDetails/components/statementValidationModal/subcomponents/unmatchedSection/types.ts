import type { GroupedParticipation } from '../../types'

export interface UnmatchedSectionProps {
  unmatched: GroupedParticipation[]
  onViewReceipt: (url: string, name: string) => void
}