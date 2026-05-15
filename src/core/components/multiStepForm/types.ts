import type { UseFormClearErrors, UseFormGetValues, UseFormSetError, UseFormSetValue, FieldValues } from 'react-hook-form'
import type { ReactNode } from 'react'

export interface ActionContext {
  setMultipleValues: (values: Record<string, unknown>, shouldClearErrors?: boolean) => void
  clearErrors: UseFormClearErrors<FieldValues>
  getParentValues?: UseFormGetValues<FieldValues>
  getValues: UseFormGetValues<FieldValues>
  setError: UseFormSetError<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  data: FieldValues
}

export interface FieldOption {
  label: string
  value: string
}

export interface FieldValidation {
  message: string
  pattern: string
}

export interface SearchResultColumn {
  header: string
  key: string
}

export interface TreeConfig {
  childrenKey: string
  labelKey: string
  valueKey: string
}

export interface SearchConfig {
  onSearch: (filters: Record<string, unknown>) => Promise<Record<string, unknown>[]>
  onSelect: (item: Record<string, unknown>, context: ActionContext) => void
  columns: SearchResultColumn[]
  initialFilterName?: string
  autoSearchOnOpen?: boolean
  viewMode?: 'table' | 'tree'
  treeConfig?: TreeConfig
  pagination?: boolean
  fields: FormField[]
  title: string
}

export interface TableAction {
  onClick: (row: Record<string, unknown>, context: ActionContext) => void
  label: string
  icon?: string
}

export interface TableColumn {
  format?: (row: Record<string, unknown>, contextData: FieldValues) => ReactNode
  header: string
  key: string
}

export interface FormModalConfig {
  onConfirm: (values: Record<string, unknown>, context: ActionContext) => void
  getInitialValues?: (context: ActionContext) => Record<string, unknown>
  onCancel?: (context: ActionContext) => void
  gridColumns?: number
  fields: FormField[]
  title: string
}

export interface FormField {
  type?: 'text' | 'number' | 'email' | 'select' | 'autocomplete' | 'info' | 'date' | 'button' | 'table' | 'currency' | 'percentage' | 'divider' | 'file'
  disabled?: boolean | ((context: ActionContext) => boolean)
  required?: boolean | ((context: ActionContext) => boolean)
  readOnly?: boolean | ((context: ActionContext) => boolean)
  renderRowDetail?: (row: Record<string, unknown>, context: ActionContext) => ReactNode
  options?: FieldOption[] | ((context: ActionContext) => FieldOption[])
  conditionalRender?: (context: ActionContext) => boolean
  onChange?: (value: unknown, context: ActionContext) => void
  onButtonClick?: (context: ActionContext) => void
  buttonVariant?: 'text' | 'outlined' | 'contained'
  tableRowFilter?: (row: Record<string, unknown>) => boolean
  tableData?: Record<string, unknown>[]
  tableColumns?: TableColumn[]
  tableActions?: TableAction[]
  formModalConfig?: FormModalConfig
  searchConfig?: SearchConfig
  validation?: FieldValidation
  mask?: string | RegExp
  modalTrigger?: string
  disableFuture?: boolean
  disablePast?: boolean
  multiple?: boolean
  freeSolo?: boolean
  maxDate?: string
  minDate?: string
  colSpan?: number
  tooltip?: string
  newRow?: boolean
  preSet?: string
  label?: string
  icon?: string
  name: string
}

export interface FormGroup {
  conditionalRender?: (context: ActionContext) => boolean
  subGroups?: FormGroup[]
  collapsible?: boolean
  gridColumns?: number
  highlight?: boolean
  seamless?: boolean
  fields: FormField[]
  title?: string
}

export interface FormAction {
  disabled?: boolean | ((context: ActionContext) => boolean)
  onClick?: (context: ActionContext) => Promise<boolean | void>
  actionType: 'next' | 'prev' | 'submit' | 'custom'
  variant?: 'contained' | 'outlined' | 'text'
  label: string
}

export interface FormStep {
  readOnly?: boolean | ((context: ActionContext) => boolean)
  conditionalRender?: (context: ActionContext) => boolean
  testData?: Record<string, unknown>
  actions: FormAction[]
  groups: FormGroup[]
  title: string
  id: string
}

export interface FormConfig {
  fieldPreSets?: Record<string, Partial<FormField>>
  formStyle?: 'simple' | 'collapsed'
  steps: FormStep[]
}

export interface MultiStepFormProps {
  onSubmit: (data: Record<string, unknown>) => void
  initialData?: Record<string, unknown>
  config: FormConfig
}