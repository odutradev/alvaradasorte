import { ActionsContainer, ActionButton } from './styles'

import type { ActionButtonsProps } from './types'

const ActionButtons = ({ onExecuteAction, isActionLoading, isNextDisabled, context, actions }: ActionButtonsProps) => {
  if (!actions?.length) return null

  return (
    <ActionsContainer>
      {actions.map((action) => {
        const isNext = action.actionType === 'next'
        const isCustomDisabled = typeof action.disabled === 'function' ? action.disabled(context) : !!action.disabled
        const isDisabled = (isNext && isNextDisabled) || isActionLoading || isCustomDisabled

        return (
          <ActionButton
            key={`${action.label}-${action.actionType}`}
            variant={action.variant || 'contained'}
            onClick={() => onExecuteAction(action)}
            disabled={isDisabled}
            type="button"
          >
            {action.label}
          </ActionButton>
        )
      })}
    </ActionsContainer>
  )
}

export default ActionButtons