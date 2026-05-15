import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pt-br'

import { FormContainer, StepContainer, LoadingOverlay } from './styles'
import ActionButtons from './subcomponents/actionButtons'
import StepIndicator from './subcomponents/stepIndicator'
import FieldRenderer from './subcomponents/fieldRenderer'
import { useMultiStepForm } from './hooks/useMultiStepForm'
import DevTools from './subcomponents/devTools'
import { useDevTools } from './hooks/useDevTools'
import Loading from '../loading'

import type { MultiStepFormProps } from './types'
import type { FormEvent } from 'react'

const MultiStepForm = (props: MultiStepFormProps) => {
  const {
    isCurrentStepValid,
    currentStepIndex,
    isActionLoading,
    isStepReadOnly,
    executeAction,
    visibleGroups,
    actionContext,
    visibleSteps,
    currentStep,
    control
  } = useMultiStepForm(props)

  const { isDevToolsOpen } = useDevTools()

  if (!currentStep) return null

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormContainer onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
        <DevTools
          context={actionContext}
          isOpen={isDevToolsOpen}
          config={props.config}
        />
        <StepIndicator
          currentStepIndex={currentStepIndex}
          steps={visibleSteps}
        />
        <StepContainer $hasIndicator={visibleSteps.length > 1}>
          <FieldRenderer
            formStyle={props.config.formStyle || 'simple'}
            isStepReadOnly={isStepReadOnly}
            context={actionContext}
            groups={visibleGroups}
            control={control}
          />
          <ActionButtons
            isNextDisabled={!isCurrentStepValid}
            onExecuteAction={executeAction}
            isActionLoading={isActionLoading}
            actions={currentStep.actions}
            context={actionContext}
          />
        </StepContainer>
        {isActionLoading && (
          <LoadingOverlay>
            <Loading
              message="Processando"
              showSpinner
            />
          </LoadingOverlay>
        )}
      </FormContainer>
    </LocalizationProvider>
  )
}

export default MultiStepForm