import type { TableFiltersConfig } from '@core/components/table/types'
import type { FiltersRecord } from '@core/services/createAction/types'

export interface FiltersProps {
  onApply: (filters: FiltersRecord) => void
  config?: TableFiltersConfig
  activeFilters?: FiltersRecord
}