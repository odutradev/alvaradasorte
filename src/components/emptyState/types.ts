import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  sx?: SxProps<Theme>
}