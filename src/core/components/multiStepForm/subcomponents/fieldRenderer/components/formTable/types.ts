import type { FormField, ActionContext } from '../../../../types'

export interface FormTableProps {
  context: ActionContext
  readOnly?: boolean
  field: FormField
}