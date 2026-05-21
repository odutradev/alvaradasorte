import type { ParticipationResponse } from '@services/sweepstakes/types'

export interface CsvRow {
  [key: string]: string
}

export interface MatchedParticipant {
  participation: ParticipationResponse
  csvRow: CsvRow
  similarityScore: number
}

export interface ValidationResult {
  matched: MatchedParticipant[]
  unmatched: ParticipationResponse[]
  unidentified: CsvRow[]
}

export type ValidationStep = 'upload' | 'columns' | 'results'

export interface StatementValidationModalProps {
  participations: ParticipationResponse[]
  open: boolean
  onClose: () => void
}