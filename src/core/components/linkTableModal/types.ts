import type { TableFiltersConfig, TableColumn } from '@core/components/table/types'

export interface BaseItem {
  id: string
}

export type TableActionParams = {
  filters?: Record<string, unknown>
  limit: number
  page: number
}

export interface LinkTableModalProps<T extends BaseItem> {
  action: (params: TableActionParams) => Promise<unknown>
  onConfirm: (selectedIds: string[]) => Promise<void>
  filtersConfig?: TableFiltersConfig
  columns: TableColumn<T>[]
  excludeIds: string[]
  onClose: () => void
  title: string
  open: boolean
}