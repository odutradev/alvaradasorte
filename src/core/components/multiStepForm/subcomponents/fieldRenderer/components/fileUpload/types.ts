export interface FileFieldValue {
  description: string
  file: File
}

export interface FileUploadProps {
  onChange: (val: FileFieldValue | null) => void
  value: FileFieldValue | null
  orderNumber: number
  readOnly?: boolean
  required?: boolean
  error?: string
  label: string
}