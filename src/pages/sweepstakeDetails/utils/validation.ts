import { normalizeString, jaroWinklerSimilarity } from '@utils/string'

import type { CsvRow, ValidationResult, MatchedParticipant, GroupedParticipation, UnidentifiedRow } from '../components/statementValidationModal/types'
import type { ParticipationResponse } from '@services/sweepstakes/types'

const SIMILARITY_THRESHOLD = 0.9

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

export const parseBrCurrency = (val: string): number => {
  if (!val) return 0
  const cleaned = val.replace(/[^0-9,-]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export const runValidation = (participations: ParticipationResponse[], rows: CsvRow[], nameColumn: string, valueColumn: string): ValidationResult => {
  const groupedMap = participations.reduce<Record<string, GroupedParticipation>>((acc, p) => {
    if (!acc[p.userId]) acc[p.userId] = { ...p, count: 1 }
    else acc[p.userId].count += 1
    return acc
  }, {})
  const groupedParticipations = Object.values(groupedMap)

  const negatives: UnidentifiedRow[] = []
  const positives: UnidentifiedRow[] = []

  rows.forEach((row, i) => {
    const parsedValue = parseBrCurrency(row[valueColumn])
    if (parsedValue < 0) negatives.push({ row, originalRowIndex: i, parsedValue })
    else positives.push({ row, originalRowIndex: i, parsedValue })
  })

  const matchedMap = new Map<string, MatchedParticipant>()
  const unidentified: UnidentifiedRow[] = []

  positives.forEach(item => {
    const normalizedName = normalizeString(item.row[nameColumn] ?? '')
    const best = groupedParticipations.reduce<{ score: number; part: GroupedParticipation | null }>(
      (b, p) => {
        const score = jaroWinklerSimilarity(normalizeString(p.userName), normalizedName)
        return score > b.score ? { score, part: p } : b
      },
      { score: 0, part: null }
    )

    if (best.score >= SIMILARITY_THRESHOLD && best.part) {
      const existing = matchedMap.get(best.part.id) ?? { participation: best.part, totalValue: 0, rows: [] }
      existing.rows.push({
        originalRowIndex: item.originalRowIndex,
        similarityScore: best.score,
        parsedValue: item.parsedValue,
        isManual: false,
        csvRow: item.row
      })
      existing.totalValue += item.parsedValue
      matchedMap.set(best.part.id, existing)
    } else {
      unidentified.push(item)
    }
  })

  const unmatched = groupedParticipations.filter(p => !matchedMap.has(p.id))

  const sortByUserName = (a: { userName: string }, b: { userName: string }) => a.userName.localeCompare(b.userName)
  const sortByNameColumn = (a: UnidentifiedRow, b: UnidentifiedRow) => (a.row[nameColumn] ?? '').localeCompare(b.row[nameColumn] ?? '')

  return {
    matched: Array.from(matchedMap.values()).sort((a, b) => sortByUserName(a.participation, b.participation)),
    unmatched: unmatched.sort(sortByUserName),
    unidentified: unidentified.sort(sortByNameColumn),
    negatives: negatives.sort(sortByNameColumn)
  }
}