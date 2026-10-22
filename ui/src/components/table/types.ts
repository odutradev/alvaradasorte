import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'

export interface TableColumn<T> {
  id: string
  label: ReactNode
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  width?: string | number
  minWidth?: string | number
  headerSx?: SxProps<Theme>
  cellSx?: SxProps<Theme>
  render?: (row: T, index: number) => ReactNode
}

export interface TableProps<T> {
  columns?: TableColumn<T>[]
  data?: T[]
  getRowKey?: (row: T, index: number) => string | number
  loading?: boolean
  loadingComponent?: ReactNode
  emptyState?: ReactNode
  size?: 'small' | 'medium'
  stickyHeader?: boolean
  hover?: boolean
  pagination?: ReactNode
  ariaLabel?: string
  onRowClick?: (row: T, index: number) => void
  sx?: SxProps<Theme>
  containerSx?: SxProps<Theme>
  children?: ReactNode
}
