import type { ParticipationResponse } from '@services/sweepstakes/types'

export interface CsvRow {
  [key: string]: string
}

export interface GroupedParticipation extends ParticipationResponse {
  count: number
}

export interface MatchedRow {
  originalRowIndex: number
  similarityScore: number
  parsedValue: number
  isManual?: boolean
  csvRow: CsvRow
}

export interface MatchedParticipant {
  participation: GroupedParticipation
  totalValue: number
  rows: MatchedRow[]
}

export interface UnidentifiedRow {
  originalRowIndex: number
  parsedValue: number
  row: CsvRow
}

export interface ValidationResult {
  unidentified: UnidentifiedRow[]
  unmatched: GroupedParticipation[]
  matched: MatchedParticipant[]
  negatives: UnidentifiedRow[]
}

export type ValidationStep = 'upload' | 'columns' | 'results'

export interface StatementValidationModalProps {
  participations: ParticipationResponse[]
  quotaPrice?: number
  onClose: () => void
  open: boolean
}