import type { MatchedParticipant } from '../../types'

export interface MatchedSectionProps {
  expectedValue: number
  matched: MatchedParticipant[]
  valueColumn: string
  onUndo: (id: string, rowIndex: number) => void
}