import type { ParticipationResponse } from '@services/sweepstakes/types'

export interface CsvRow {
  [key: string]: string
}

export interface MatchedParticipant {
  participation: ParticipationResponse
  originalRowIndex: number
  similarityScore: number
  isManual?: boolean
  csvRow: CsvRow
}

export interface UnidentifiedRow {
  originalRowIndex: number
  row: CsvRow
}

export interface ValidationResult {
  unidentified: UnidentifiedRow[]
  unmatched: ParticipationResponse[]
  matched: MatchedParticipant[]
}

export type ValidationStep = 'upload' | 'columns' | 'results'

export interface StatementValidationModalProps {
  participations: ParticipationResponse[]
  onClose: () => void
  open: boolean
}