import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'

export interface PageContainerProps {
  children: ReactNode
  showBackButton?: boolean
  onBack?: () => void
  backLabel?: string
  fullHeight?: boolean
  contentSx?: SxProps<Theme>
}
