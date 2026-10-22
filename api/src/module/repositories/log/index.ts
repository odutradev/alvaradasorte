import { getPaginationOptions, buildPaginatedResponse } from '@core/factories/pagination/utils'
import { firebaseDb } from '@core/database/connection'

import type { CreateLogPayload, FindAllLogFilters, LogType } from './types'
import type { PaginatedResponse } from '@core/factories/pagination/types'

const REF_PATH = 'logs'

const logRepository = {
  create: async (data: CreateLogPayload): Promise<LogType> => {
    try {
      const ref = firebaseDb.ref(REF_PATH).push()
      const id = ref.key as string
      const now = new Date().toISOString()
      const payload: LogType = {
        ...data,
        id,
        createdAt: now
      }

      await ref.set(payload)
      return payload
    } catch (err) {
      console.error('Failed to write log to Firebase:', err)
      return {
        ...data,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    }
  },

  findAll: async (filters?: FindAllLogFilters): Promise<PaginatedResponse<LogType>> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, LogType> | null

    const options = getPaginationOptions(filters)

    let rows: LogType[] = []

    if (data) {
      rows = Object.entries(data).map(([id, item]) => ({ ...item, id }))
    }

    if (filters?.category) {
      rows = rows.filter((log) => log.category === filters.category)
    }

    if (filters?.level) {
      rows = rows.filter((log) => log.level === filters.level)
    }

    if (filters?.userId) {
      rows = rows.filter((log) => log.userId === filters.userId)
    }

    if (filters?.search) {
      const s = filters.search.toLowerCase()
      rows = rows.filter((log) =>
        log.title?.toLowerCase().includes(s) ||
        log.description?.toLowerCase().includes(s) ||
        log.userName?.toLowerCase().includes(s) ||
        log.userEmail?.toLowerCase().includes(s) ||
        log.targetName?.toLowerCase().includes(s) ||
        log.action?.toLowerCase().includes(s) ||
        log.errorMessage?.toLowerCase().includes(s)
      )
    }

    // Ordenação decrescente por data (mais recentes primeiro)
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const count = rows.length
    const paginatedRows = rows.slice(options.offset, options.offset + options.limit)

    return buildPaginatedResponse({ rows: paginatedRows, count }, options.page, options.limit)
  },

  findById: async (id: string): Promise<LogType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')
    if (!snapshot.exists()) return null
    return { ...snapshot.val(), id }
  }
}

export default logRepository
