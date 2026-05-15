import type { PaginatedMeta } from '@core/services/createAction/types'
import type { ReactNode } from 'react'

export interface TableFooterProps {
  onLimitChange?: (limit: number) => void
  onPageChange?: (page: number) => void
  footerPosition?: 'left' | 'right'
  footerContent?: ReactNode
  meta?: PaginatedMeta
}