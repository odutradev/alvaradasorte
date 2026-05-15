import type { PaginatedMeta, FiltersRecord } from '@core/services/createAction/types'
import type { UsePaginationProps } from '@core/hooks/usePagination/types'
import type { FormGroup } from '@core/components/multiStepForm/types'
import type { ReactNode } from 'react'

export type TableFiltersConfig = FormGroup[]

export interface TableColumn<T> {
  key: keyof T | string
  render?: (row: T) => ReactNode
  header: string
}

export interface TableAction<T> {
  disabled?: (row: T) => boolean
  onClick: (row: T) => void
  icon: ReactNode
  label: string
}

export interface TableButton {
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  variant?: 'text' | 'outlined' | 'contained'
  onClick: () => void
  disabled?: boolean
  icon?: ReactNode
  label: string
}

export interface BaseTableProps<T> {
  footerPosition?: 'left' | 'right'
  filtersConfig?: TableFiltersConfig
  headerButtons?: TableButton[]
  actions?: TableAction<T>[]
  columns: TableColumn<T>[]
  footerContent?: ReactNode
  headerContent?: ReactNode
  disableHeader?: boolean
  headerTitle?: string
  totalItems?: number
}

export interface ManualTableProps<T> extends BaseTableProps<T> {
  onFilterChange?: (filters: FiltersRecord) => void
  onLimitChange?: (limit: number) => void
  onPageChange?: (page: number) => void
  activeFilters?: FiltersRecord
  paginationProps?: never
  onReload?: () => void
  meta?: PaginatedMeta
  isLoading: boolean
  data: T[]
}

export interface AutoTableProps<T> extends BaseTableProps<T> {
  paginationProps: UsePaginationProps<T>
  onFilterChange?: never
  onLimitChange?: never
  onPageChange?: never
  activeFilters?: never
  isLoading?: never
  onReload?: never
  meta?: never
  data?: never
}

export type TableProps<T> = ManualTableProps<T> | AutoTableProps<T>