import type { TableColumn, TableAction } from '../../types'
import type { MouseEvent } from 'react'

export interface TableBodyProps<T> {
  onOpenMenu: (event: MouseEvent<HTMLElement>, row: T) => void
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  displayLoading: boolean
  data: T[]
}