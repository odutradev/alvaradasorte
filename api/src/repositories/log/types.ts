export type LogCategory = 'user' | 'admin' | 'system'
export type LogLevel = 'info' | 'warn' | 'error'

export interface LogType {
  id: string
  category: LogCategory
  level: LogLevel
  action: string
  title: string
  description?: string
  userId?: string
  userName?: string
  userEmail?: string
  targetId?: string
  targetName?: string
  details?: Record<string, any>
  errorMessage?: string
  errorStack?: string
  ipAddress?: string
  createdAt: string
}

export type CreateLogPayload = Omit<LogType, 'id' | 'createdAt'>

export interface FindAllLogFilters {
  page?: number
  limit?: number
  category?: LogCategory
  level?: LogLevel
  userId?: string
  search?: string
}
