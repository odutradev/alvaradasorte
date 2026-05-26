import { useState, useCallback, useMemo } from 'react'

import { runValidation, autoDetectColumn, parseCsv } from '../../../utils/validation'

import type { ParticipationResponse } from '@services/sweepstakes/types'
import type { UseStatementValidationReturn } from './types'
import type { ValidationResult, ValidationStep, CsvRow, UnidentifiedRow } from '../types'

const VALUE_CANDIDATES = ['valor', 'value', 'quantia', 'amount', 'montante']
const NAME_CANDIDATES = ['nome', 'name', 'descricao', 'remetente', 'pagador', 'titular']

const useStatementValidation = (participations: ParticipationResponse[], quotaPrice?: number): UseStatementValidationReturn => {
  const [selectedReceipt, setSelectedReceipt] = useState<{ url: string; name: string } | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [step, setStep] = useState<ValidationStep>('upload')
  const [searchQuery, setSearchQuery] = useState('')
  const [valueColumn, setValueColumn] = useState('')
  const [csvRows, setCsvRows] = useState<CsvRow[]>([])
  const [nameColumn, setNameColumn] = useState('')

  const estimatedQuotaPrice = useMemo(() => {
    if (quotaPrice) return quotaPrice
    if (!result || result.matched.length === 0) return 0
    const counts = result.matched.reduce<Record<number, number>>((acc, m) => {
      m.rows.forEach((r) => { acc[r.parsedValue] = (acc[r.parsedValue] || 0) + 1 })
      return acc
    }, {})
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted.length ? Number(sorted[0][0]) : 0
  }, [quotaPrice, result])

  const filteredResult = useMemo(() => {
    if (!result) return null
    const lowerQuery = searchQuery.toLowerCase()
    return {
      matched: result.matched.filter((m) => m.participation.userName.toLowerCase().includes(lowerQuery)),
      unmatched: result.unmatched.filter((u) => u.userName.toLowerCase().includes(lowerQuery)),
      unidentified: result.unidentified.filter((u) => (u.row[nameColumn] ?? '').toLowerCase().includes(lowerQuery)),
      negatives: result.negatives.filter((n) => (n.row[nameColumn] ?? '').toLowerCase().includes(lowerQuery))
    }
  }, [result, searchQuery, nameColumn])

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
    if (!nameColumn || !valueColumn || !csvRows.length) return
    setResult(runValidation(participations, csvRows, nameColumn, valueColumn))
    setStep('results')
  }, [participations, csvRows, nameColumn, valueColumn])

  const handleReset = useCallback(() => {
    setSelectedReceipt(null)
    setSearchQuery('')
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
      const itemToLink = prev.unidentified.find((u) => u.originalRowIndex === originalRowIndex)
      if (!itemToLink) return prev

      let targetMatch = prev.matched.find((m) => m.participation.id === participationId)
      let newUnmatched = prev.unmatched

      if (!targetMatch) {
        const partToMove = prev.unmatched.find((p) => p.id === participationId)
        if (!partToMove) return prev
        targetMatch = { participation: partToMove, totalValue: 0, rows: [] }
        newUnmatched = prev.unmatched.filter((p) => p.id !== participationId)
      }

      const updatedMatch = {
        ...targetMatch,
        totalValue: targetMatch.totalValue + itemToLink.parsedValue,
        rows: [...targetMatch.rows, {
          originalRowIndex: itemToLink.originalRowIndex,
          similarityScore: 1,
          parsedValue: itemToLink.parsedValue,
          isManual: true,
          csvRow: itemToLink.row
        }]
      }

      const newMatched = [...prev.matched.filter((m) => m.participation.id !== participationId), updatedMatch]
        .sort((a, b) => a.participation.userName.localeCompare(b.participation.userName))

      return {
        ...prev,
        matched: newMatched,
        unidentified: prev.unidentified.filter((u) => u.originalRowIndex !== originalRowIndex),
        unmatched: newUnmatched
      }
    })
  }, [])

  const handleUndoLink = useCallback((participationId: string, originalRowIndex: number) => {
    setResult((prev) => {
      if (!prev) return prev
      const matchGroup = prev.matched.find((m) => m.participation.id === participationId)
      if (!matchGroup) return prev

      const rowToUndo = matchGroup.rows.find((r) => r.originalRowIndex === originalRowIndex)
      if (!rowToUndo || !rowToUndo.isManual) return prev

      const updatedRows = matchGroup.rows.filter((r) => r.originalRowIndex !== originalRowIndex)
      const newMatched = prev.matched.filter((m) => m.participation.id !== participationId)
      let newUnmatched = prev.unmatched

      if (updatedRows.length > 0) {
        newMatched.push({
          ...matchGroup,
          totalValue: matchGroup.totalValue - rowToUndo.parsedValue,
          rows: updatedRows
        })
        newMatched.sort((a, b) => a.participation.userName.localeCompare(b.participation.userName))
      } else {
        newUnmatched = [...prev.unmatched, matchGroup.participation].sort((a, b) => a.userName.localeCompare(b.userName))
      }

      const restoredUnidentified: UnidentifiedRow = {
        originalRowIndex: rowToUndo.originalRowIndex,
        parsedValue: rowToUndo.parsedValue,
        row: rowToUndo.csvRow
      }

      return {
        ...prev,
        matched: newMatched,
        unmatched: newUnmatched,
        unidentified: [...prev.unidentified, restoredUnidentified].sort((a, b) => (a.row[nameColumn] ?? '').localeCompare(b.row[nameColumn] ?? ''))
      }
    })
  }, [nameColumn])

  return {
    estimatedQuotaPrice,
    setSelectedReceipt,
    selectedReceipt,
    filteredResult,
    setSearchQuery,
    csvRowCount: csvRows.length,
    handleFileUpload,
    handleManualLink,
    handleUndoLink,
    handleValidate,
    setValueColumn,
    setNameColumn,
    searchQuery,
    valueColumn,
    handleReset,
    csvHeaders,
    nameColumn,
    result,
    step
  }
}

export default useStatementValidation