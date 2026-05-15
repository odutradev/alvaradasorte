import type { TableAction } from '../../types'

export interface ActionMenuProps<T> {
  onActionClick: (actionClick: (row: T) => void) => void
  actions?: TableAction<T>[]
  anchorEl: HTMLElement | null
  selectedRow: T | null
  onClose: () => void
}