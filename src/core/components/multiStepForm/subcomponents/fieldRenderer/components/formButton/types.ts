import type { FormField, ActionContext } from '../../../../types'

export interface FormButtonProps {
  context: ActionContext
  readOnly?: boolean
  field: FormField
}