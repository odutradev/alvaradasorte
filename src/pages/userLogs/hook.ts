import { useState, useEffect, useCallback } from 'react'
import { getLogs } from '@services/logs'
import useAuth from '@hooks/useAuth'

import type { LogItem } from '@services/logs/types'

export const useUserLogs = () => {
  const { user } = useAuth()
  const [logs, setLogs] = useState<LogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchLogs = useCallback(async (targetPage = 1) => {
    try {
      setLoading(true)
      const response = await getLogs({
        page: targetPage,
        limit: 15,
        category: 'user'
      })
      setLogs(response.data || [])
      setPage(response.pagination?.page || 1)
      setTotalPages(response.pagination?.totalPages || 1)
      setTotal(response.pagination?.total || 0)
    } catch (error) {
      console.error('Failed to load user logs', error)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs(page)
  }, [fetchLogs, page])

  return {
    user,
    logs,
    loading,
    page,
    totalPages,
    total,
    setPage,
    refetch: () => fetchLogs(page)
  }
}

export default useUserLogs
