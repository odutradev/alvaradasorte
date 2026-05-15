import type { PaginatedResponse, PaginatedMeta, FiltersRecord } from '@core/services/createAction/types'

export interface UsePaginationProps<T> {
  action: (params: { limit: number; page: number; filters?: FiltersRecord }) => Promise<PaginatedResponse<T> | unknown>
  initialFilters?: FiltersRecord
  fetchOnMount?: boolean
  initialLimit?: number
  initialPage?: number
}

export interface UsePaginationReturn<T> {
  handleFilterChange: (filters: FiltersRecord) => void
  handleLimitChange: (limit: number) => void
  handlePageChange: (page: number) => void
  reload: () => Promise<void>
  activeFilters: FiltersRecord
  meta: PaginatedMeta
  isLoading: boolean
  data: T[]
}