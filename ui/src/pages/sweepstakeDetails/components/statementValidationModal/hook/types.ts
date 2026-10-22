import type { ValidationStep, ValidationResult } from '../types'

export interface UseStatementValidationReturn {
  selectedReceipt: { url: string; name: string } | null
  filteredResult: ValidationResult | null
  result: ValidationResult | null
  estimatedQuotaPrice: number
  csvRowCount: number
  valueColumn: string
  searchQuery: string
  csvHeaders: string[]
  nameColumn: string
  step: ValidationStep
  handleManualLink: (participationId: string, originalRowIndex: number) => void
  handleUndoLink: (participationId: string, originalRowIndex: number) => void
  setSelectedReceipt: (val: { url: string; name: string } | null) => void
  setSearchQuery: (v: string) => void
  handleFileUpload: (file: File) => void
  setValueColumn: (v: string) => void
  setNameColumn: (v: string) => void
  handleValidate: () => void
  handleReset: () => void
}