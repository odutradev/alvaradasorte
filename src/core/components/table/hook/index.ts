import { useCallback, useEffect, useState } from 'react'

import type { AutoTableProps, ManualTableProps } from '../types'
import type { UseTableProps, UseTableReturn } from './types'
import type { MouseEvent } from 'react'

const useTable = <T extends { id: string | number }>({ isLoading, props }: UseTableProps<T> = {}): UseTableReturn<T> => {
  const [displayLoading, setDisplayLoading] = useState(!!isLoading)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedRow, setSelectedRow] = useState<T | null>(null)

  const isAutoTable = !!props && 'paginationProps' in props && !!(props as AutoTableProps<T>).paginationProps

  useEffect(() => {
    if (isLoading === undefined) return
    let timer: ReturnType<typeof setTimeout>
    if (isLoading) {
      setDisplayLoading(true)
    } else {
      timer = setTimeout(() => setDisplayLoading(false), 500)
    }
    return () => clearTimeout(timer)
  }, [isLoading])

  const handleOpenMenu = useCallback((event: MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null)
    setSelectedRow(null)
  }, [])

  const handleActionClick = useCallback((actionClick: (row: T) => void) => {
    if (selectedRow) actionClick(selectedRow)
    handleCloseMenu()
  }, [selectedRow, handleCloseMenu])

  return {
    manualProps: props as ManualTableProps<T>,
    autoProps: props as AutoTableProps<T>,
    handleActionClick,
    handleCloseMenu,
    handleOpenMenu,
    displayLoading,
    isAutoTable,
    selectedRow,
    anchorEl
  }
}

export default useTable