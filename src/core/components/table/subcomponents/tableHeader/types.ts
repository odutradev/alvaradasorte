import type { TableFiltersConfig, TableButton } from '../../types'
import type { FiltersRecord } from '@core/services/createAction/types'
import type { ReactNode } from 'react'

export interface TableHeaderProps {
  onFilterChange?: (filters: FiltersRecord) => void
  activeFilters?: FiltersRecord
  filtersConfig?: TableFiltersConfig
  headerButtons?: TableButton[]
  headerContent?: ReactNode
  displayLoading: boolean
  headerTitle?: string
  onReload?: () => void
  totalItems: number
}