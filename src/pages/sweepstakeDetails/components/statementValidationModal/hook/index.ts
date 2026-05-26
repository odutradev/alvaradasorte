import { useState, useCallback } from 'react'

import { runValidation, autoDetectColumn, parseCsv } from '../../../utils/validation'

import type { ParticipationResponse } from '@services/sweepstakes/types'
import type { UseStatementValidationReturn } from './types'
import type { ValidationResult, ValidationStep, CsvRow } from '../types'

const VALUE_CANDIDATES = ['valor', 'value', 'quantia', 'amount', 'montante']
const NAME_CANDIDATES = ['nome', 'name', 'descricao', 'remetente', 'pagador', 'titular']

const useStatementValidation = (participations: ParticipationResponse[]): UseStatementValidationReturn => {
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [step, setStep] = useState<ValidationStep>('upload')
  const [valueColumn, setValueColumn] = useState('')
  const [csvRows, setCsvRows] = useState<CsvRow[]>([])
  const [nameColumn, setNameColumn] = useState('')

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
    setResult(null)
    setStep('upload')
    setCsvHeaders([])
    setValueColumn('')
    setNameColumn('')
    setCsvRows([])
  }, [])

  const handleManualLink = useCallback((participationId: string, originalRowIndex: number) => {
    setResult((prev) => {
      if (!prev) return prev
      const participation = prev.unmatched.find((p) => p.id === participationId)
      const unidentifiedItem = prev.unidentified.find((u) => u.originalRowIndex === originalRowIndex)
      if (!participation || !unidentifiedItem) return prev
      return {
        matched: [...prev.matched, { participation, csvRow: unidentifiedItem.row, similarityScore: 1, isManual: true, originalRowIndex }],
        unidentified: prev.unidentified.filter((u) => u.originalRowIndex !== originalRowIndex),
        unmatched: prev.unmatched.filter((p) => p.id !== participationId)
      }
    })
  }, [])

  const handleUndoLink = useCallback((participationId: string) => {
    setResult((prev) => {
      if (!prev) return prev
      const match = prev.matched.find((m) => m.participation.id === participationId && m.isManual)
      if (!match) return prev
      return {
        unidentified: [...prev.unidentified, { row: match.csvRow, originalRowIndex: match.originalRowIndex }].sort((a, b) => a.originalRowIndex - b.originalRowIndex),
        matched: prev.matched.filter((m) => m.participation.id !== participationId),
        unmatched: [...prev.unmatched, match.participation]
      }
    })
  }, [])

  return {
    csvRowCount: csvRows.length,
    handleFileUpload,
    handleManualLink,
    handleUndoLink,
    handleValidate,
    setValueColumn,
    setNameColumn,
    valueColumn,
    handleReset,
    csvHeaders,
    nameColumn,
    result,
    step
  }
}

export default useStatementValidation