import { useState, useCallback } from 'react'

import { normalizeString, jaroWinklerSimilarity } from '@utils/string'

import type { CsvRow, ValidationResult, ValidationStep, MatchedParticipant } from '../types'
import type { ParticipationResponse } from '@services/sweepstakes/types'
import type { UseStatementValidationReturn } from './types'

const SIMILARITY_THRESHOLD = 0.75
const NAME_CANDIDATES = ['nome', 'name', 'descricao', 'remetente', 'pagador', 'titular']
const VALUE_CANDIDATES = ['valor', 'value', 'quantia', 'amount', 'montante']

const detectSeparator = (line: string): string => (line.includes(';') ? ';' : ',')

const parseCsv = (text: string): { headers: string[]; rows: CsvRow[] } => {
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

const autoDetectColumn = (headers: string[], candidates: string[]): string | null =>
  headers.find((h) => candidates.some((c) => normalizeString(h).includes(c))) ?? null

const runValidation = (
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

const useStatementValidation = (participations: ParticipationResponse[]): UseStatementValidationReturn => {
  const [step, setStep] = useState<ValidationStep>('upload')
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<CsvRow[]>([])
  const [nameColumn, setNameColumn] = useState('')
  const [valueColumn, setValueColumn] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { headers, rows } = parseCsv(text)
      if (!headers.length) return
      setCsvHeaders(headers)
      setCsvRows(rows)
      setNameColumn(autoDetectColumn(headers, NAME_CANDIDATES) ?? headers[0])
      setValueColumn(autoDetectColumn(headers, VALUE_CANDIDATES) ?? headers[1] ?? headers[0])
      setStep('columns')
    }
    reader.readAsText(file, 'UTF-8')
  }, [])

  const handleValidate = useCallback(() => {
    if (!nameColumn || !csvRows.length) return
    setResult(runValidation(participations, csvRows, nameColumn))
    setStep('results')
  }, [participations, csvRows, nameColumn])

  const handleReset = useCallback(() => {
    setStep('upload')
    setCsvHeaders([])
    setCsvRows([])
    setNameColumn('')
    setValueColumn('')
    setResult(null)
  }, [])

  return {
    step,
    csvHeaders,
    csvRowCount: csvRows.length,
    nameColumn,
    valueColumn,
    result,
    setNameColumn,
    setValueColumn,
    handleFileUpload,
    handleValidate,
    handleReset
  }
}

export default useStatementValidation