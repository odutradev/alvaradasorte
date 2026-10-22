import { useState, useEffect, useCallback, useTransition } from 'react'
import { getLogs } from '@services/logs'

import type { LogCategory, LogLevel, LogItem } from '@services/logs/types'

export const useAdminLogs = () => {
  const [category, setCategory] = useState<LogCategory>('system')
  const [level, setLevel] = useState<LogLevel | 'all'>('all')
  const [userSearch, setUserSearch] = useState('')
  const [textSearch, setTextSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [logs, setLogs] = useState<LogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()

  const fetchLogs = useCallback(
    async (
      cat: LogCategory,
      lvl: LogLevel | 'all',
      uSearch: string,
      tSearch: string,
      targetPage: number
    ) => {
      try {
        setLoading(true)
        const combinedSearch = [uSearch.trim(), tSearch.trim()].filter(Boolean).join(' ') || undefined

        const response = await getLogs({
          category: cat,
          level: lvl === 'all' ? undefined : lvl,
          search: combinedSearch,
          page: targetPage,
          limit: 20
        })

        startTransition(() => {
          setLogs(response.data || [])
          setPage(response.pagination?.page || 1)
          setTotalPages(response.pagination?.totalPages || 1)
          setTotal(response.pagination?.total || 0)
        })
      } catch (error) {
        console.error('Failed to load admin logs', error)
        setLogs([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(category, level, userSearch, textSearch, page)
    }, 250)

    return () => clearTimeout(timer)
  }, [category, level, userSearch, textSearch, page, fetchLogs])

  const handleCategoryChange = (newCat: LogCategory) => {
    setCategory(newCat)
    setPage(1)
  }

  const handleLevelChange = (newLevel: LogLevel | 'all') => {
    setLevel(newLevel)
    setPage(1)
  }

  const handleUserSearchChange = (val: string) => {
    setUserSearch(val)
    setPage(1)
  }

  const handleTextSearchChange = (val: string) => {
    setTextSearch(val)
    setPage(1)
  }

  const clearFilters = () => {
    setUserSearch('')
    setTextSearch('')
    setLevel('all')
    setPage(1)
  }

  return {
    category,
    level,
    userSearch,
    textSearch,
    page,
    totalPages,
    total,
    logs,
    loading,
    handleCategoryChange,
    handleLevelChange,
    handleUserSearchChange,
    handleTextSearchChange,
    setPage,
    clearFilters,
    refetch: () => fetchLogs(category, level, userSearch, textSearch, page)
  }
}

export default useAdminLogs
