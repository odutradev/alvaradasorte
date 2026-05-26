import type { ValidationStep, ValidationResult } from '../../types'

export interface UseStatementValidationReturn {
  step: ValidationStep
  csvHeaders: string[]
  csvRowCount: number
  nameColumn: string
  valueColumn: string
  result: ValidationResult | null
  setNameColumn: (v: string) => void
  setValueColumn: (v: string) => void
  handleFileUpload: (file: File) => void
  handleValidate: () => void
  handleReset: () => void
}