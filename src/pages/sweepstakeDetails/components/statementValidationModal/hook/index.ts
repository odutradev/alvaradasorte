import { useState, useCallback } from 'react'

import { parseCsv, autoDetectColumn, runValidation } from '../../../utils/validation'

import type { ParticipationResponse } from '@services/sweepstakes/types'
import type { CsvRow, ValidationStep, ValidationResult } from '../types'
import type { UseStatementValidationReturn } from './types'

const NAME_CANDIDATES = ['nome', 'name', 'descricao', 'remetente', 'pagador', 'titular']
const VALUE_CANDIDATES = ['valor', 'value', 'quantia', 'amount', 'montante']

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