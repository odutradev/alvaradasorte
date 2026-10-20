import type { ReactNode } from 'react'
import type { DialogProps } from '@mui/material/Dialog'
import type { SxProps, Theme } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

export interface ModalProps extends Omit<DialogProps, 'title'> {
  open: boolean
  onClose?: (event?: object, reason?: 'backdropClick' | 'escapeKeyDown') => void
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  hideCloseButton?: boolean
  headerRight?: ReactNode
  paperSx?: SxProps<Theme>
  headerSx?: SxProps<Theme>
  bodySx?: SxProps<Theme>
  footerSx?: SxProps<Theme>
  disableBodyWrap?: boolean
  formProps?: BoxProps<'form'>
}
