import type { Control, FieldValues } from 'react-hook-form'
import type { InputBaseComponentProps } from '@mui/material'

import type { FormGroup, ActionContext } from '../../types'

export interface MaskedInputProps extends Omit<InputBaseComponentProps, 'onChange'> {
  onChange: (event: { target: { name: string; value: string } }) => void
  maskPattern: string | RegExp
  name: string
}

export interface FieldRendererProps {
  formStyle?: 'simple' | 'collapsed'
  control: Control<FieldValues>
  isStepReadOnly?: boolean
  context: ActionContext
  groups: FormGroup[]
}