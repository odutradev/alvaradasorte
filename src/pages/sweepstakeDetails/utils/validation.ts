import { normalizeString, jaroWinklerSimilarity } from '@utils/string'

import type { CsvRow, ValidationResult, MatchedParticipant } from '../components/statementValidationModal/types'
import type { ParticipationResponse } from '@services/sweepstakes/types'

const SIMILARITY_THRESHOLD = 0.75

export const detectSeparator = (line: string): string => (line.includes(';') ? ';' : ',')

export const parseCsv = (text: string): { headers: string[]; rows: CsvRow[] } => {
  const lines = text.trim().split('\n').filter((l) => l.trim())
  if (lines.length < 2) return { headers: [], rows: [] }
  const separator = detectSeparator(lines[0])
  const headers = lines[0].split(separator).map((h) => h.trim().replace(/"/g, ''))
  const rows = lines.slice(1).map((line) => {
    const values = line.split(separator).map((v) => v.trim().replace(/"/g, ''))
    return headers.reduce<CsvRow>((acc, header, i) => ({ ...acc, [header]: values[i] ?? '' }), {})
  })
  return { headers, rows }
}

export const autoDetectColumn = (headers: string[], candidates: string[]): string | null =>
  headers.find((h) => candidates.some((c) => normalizeString(h).includes(c))) ?? null

export const runValidation = (
  participations: ParticipationResponse[],
  rows: CsvRow[],
  nameColumn: string
): ValidationResult => {
  const usedRowIndices = new Set<number>()
  const { matched, unmatched } = participations.reduce<{
    matched: MatchedParticipant[]
    unmatched: ParticipationResponse[]
  }>(
    (acc, participation) => {
      const normalizedName = normalizeString(participation.userName)
      const best = rows.reduce<{ score: number; index: number }>(
        (b, row, index) => {
          if (usedRowIndices.has(index)) return b
          const score = jaroWinklerSimilarity(normalizedName, normalizeString(row[nameColumn] ?? ''))
          return score > b.score ? { score, index } : b
        },
        { score: 0, index: -1 }
      )
      if (best.score >= SIMILARITY_THRESHOLD && best.index !== -1) {
        usedRowIndices.add(best.index)
        return {
          ...acc,
          matched: [...acc.matched, { participation, csvRow: rows[best.index], similarityScore: best.score }]
        }
      }
      return { ...acc, unmatched: [...acc.unmatched, participation] }
    },
    { matched: [], unmatched: [] }
  )
  return {
    matched,
    unmatched,
    unidentified: rows.filter((_, i) => !usedRowIndices.has(i))
  }
}