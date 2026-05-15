import type { PaginatedMeta } from '@core/services/createAction/types'

export interface PaginationProps {
  justify?: 'flex-start' | 'flex-end' | 'space-between'
  onLimitChange: (limit: number) => void
  onPageChange: (page: number) => void
  meta: PaginatedMeta
}