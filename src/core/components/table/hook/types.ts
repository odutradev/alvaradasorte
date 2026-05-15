import type { AutoTableProps, ManualTableProps, TableProps } from '../types'
import type { MouseEvent } from 'react'

export interface UseTableProps<T> {
  props?: TableProps<T>
  isLoading?: boolean
}

export interface UseTableReturn<T> {
  handleOpenMenu: (event: MouseEvent<HTMLElement>, row: T) => void
  handleActionClick: (actionClick: (row: T) => void) => void
  manualProps: ManualTableProps<T>
  autoProps: AutoTableProps<T>
  anchorEl: HTMLElement | null
  handleCloseMenu: () => void
  displayLoading: boolean
  selectedRow: T | null
  isAutoTable: boolean
}