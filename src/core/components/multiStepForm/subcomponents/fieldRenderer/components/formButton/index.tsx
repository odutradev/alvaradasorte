import { Button } from '@mui/material'
import * as MuiIcons from '@mui/icons-material'
import { useState, useEffect } from 'react'

import FormModal from '../../../formModal'
import { ButtonContainer } from './styles'

import type { FormButtonProps } from './types'

const FormButton = ({ field, context, readOnly }: FormButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const SelectedIcon = field.icon ? MuiIcons[field.icon as keyof typeof MuiIcons] : null

  const triggerValue = field.modalTrigger ? context.data[field.modalTrigger] : undefined
  useEffect(() => {
    if (triggerValue) setModalOpen(true)
  }, [triggerValue])

  const handleClose = () => {
    setModalOpen(false)
    if (field.modalTrigger) context.setValue(field.modalTrigger as never, false as never)
  }

  const handleClick = () => {
    if (field.formModalConfig) {
      setModalOpen(true)
    } else {
      field.onButtonClick?.(context)
    }
  }

  const isDisabled = readOnly || (typeof field.disabled === 'function' ? field.disabled(context) : !!field.disabled)

  return (
    <ButtonContainer>
      <Button
        variant={field.buttonVariant || 'contained'}
        disabled={isDisabled}
        startIcon={SelectedIcon ? <SelectedIcon /> : null}
        onClick={handleClick}
        fullWidth
      >
        {field.label}
      </Button>
      {modalOpen && field.formModalConfig && (
        <FormModal
          config={field.formModalConfig}
          context={context}
          onClose={handleClose}
          initialValues={field.formModalConfig.getInitialValues?.(context)}
        />
      )}
    </ButtonContainer>
  )
}

export default FormButton