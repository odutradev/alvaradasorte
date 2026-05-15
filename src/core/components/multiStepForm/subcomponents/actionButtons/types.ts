import type { ActionContext, FormAction } from '../../types'

export interface ActionButtonsProps {
  onExecuteAction: (action: FormAction) => void
  isActionLoading: boolean
  isNextDisabled: boolean
  context: ActionContext
  actions: FormAction[]
}