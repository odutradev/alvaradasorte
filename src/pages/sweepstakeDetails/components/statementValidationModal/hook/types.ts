import type { ValidationStep, ValidationResult } from '../types'

export interface UseStatementValidationReturn {
  result: ValidationResult | null
  csvRowCount: number
  valueColumn: string
  csvHeaders: string[]
  nameColumn: string
  step: ValidationStep
  handleManualLink: (participationId: string, originalRowIndex: number) => void
  handleUndoLink: (participationId: string) => void
  handleFileUpload: (file: File) => void
  setValueColumn: (v: string) => void
  setNameColumn: (v: string) => void
  handleValidate: () => void
  handleReset: () => void
}