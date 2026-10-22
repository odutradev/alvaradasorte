import type { GroupedParticipation, UnidentifiedRow } from '../../types'

export interface UnidentifiedSectionProps {
  unidentified: UnidentifiedRow[]
  unmatched: GroupedParticipation[]
  nameColumn: string
  valueColumn: string
  onLink: (participationId: string, rowIndex: number) => void
}