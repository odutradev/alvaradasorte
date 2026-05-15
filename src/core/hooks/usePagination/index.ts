import { useCallback, useEffect, useState } from 'react'

import useAction from '@core/hooks/useAction'

import type { PaginatedResponse, PaginatedMeta, FiltersRecord } from '@core/services/createAction/types'
import type { UsePaginationReturn, UsePaginationProps } from './types'

const usePagination = <T>({ fetchOnMount = true, initialFilters = {}, initialLimit = 15, initialPage = 1, action }: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [meta, setMeta] = useState<PaginatedMeta>({ totalPages: 0, limit: initialLimit, total: 0, page: initialPage })
  const [activeFilters, setActiveFilters] = useState<FiltersRecord>(initialFilters)
  const [isLoading, setIsLoading] = useState(fetchOnMount)
  const [data, setData] = useState<T[]>([])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      await useAction({
        action: async () => (await action({ limit: meta.limit, page: meta.page, filters: activeFilters })) as unknown as PaginatedResponse<T>,
        callback: (response: PaginatedResponse<T>) => {
          setMeta(response.meta)
          setData(response.data)
        },
        silent: true
      })
    } catch {
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [action, meta.page, meta.limit, activeFilters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePageChange = useCallback((page: number) => setMeta((prev) => ({ ...prev, page })), [])

  const handleLimitChange = useCallback((limit: number) => setMeta((prev) => ({ ...prev, limit, page: 1 })), [])

  const handleFilterChange = useCallback((filters: FiltersRecord) => {
    setActiveFilters(filters)
    setMeta((prev) => ({ ...prev, page: 1 }))
  }, [])

  return { handleFilterChange, handleLimitChange, handlePageChange, reload: fetchData, activeFilters, isLoading, data, meta }
}

export default usePagination