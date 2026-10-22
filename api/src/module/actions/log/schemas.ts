import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@core/factories/pagination/schemas'

extendZodWithOpenApi(z)

export const logSchema = z.object({
  id: z.string().openapi({ example: 'log-123' }),
  category: z.enum(['user', 'admin', 'system']).openapi({ example: 'user' }),
  level: z.enum(['info', 'warn', 'error']).openapi({ example: 'info' }),
  action: z.string().openapi({ example: 'SWEEPSTAKE_JOIN' }),
  title: z.string().openapi({ example: 'Cota adquirida' }),
  description: z.string().optional().openapi({ example: 'Participação registrada com sucesso' }),
  userId: z.string().optional().openapi({ example: 'user-123' }),
  userName: z.string().optional().openapi({ example: 'João Silva' }),
  userEmail: z.string().optional().openapi({ example: 'joao@email.com' }),
  targetId: z.string().optional().openapi({ example: 'bolao-456' }),
  targetName: z.string().optional().openapi({ example: 'Bolão da Mega' }),
  details: z.record(z.any()).optional().openapi({ example: { quotaCount: 2 } }),
  errorMessage: z.string().optional().openapi({ example: 'Falha ao processar' }),
  errorStack: z.string().optional().openapi({ example: 'Error: ...' }),
  ipAddress: z.string().optional().openapi({ example: '127.0.0.1' }),
  createdAt: z.string().openapi({ example: '2026-01-01T00:00:00.000Z' })
}).openapi('LogResponse')

export const listLogsQuerySchema = z.object({
  category: z.enum(['user', 'admin', 'system']).optional().openapi({ example: 'user' }),
  level: z.enum(['info', 'warn', 'error']).optional().openapi({ example: 'info' }),
  userId: z.string().optional().openapi({ example: 'user-123' }),
  search: z.string().optional().openapi({ example: 'Mega' })
}).merge(paginationQuerySchema).openapi('ListLogsQuery')

export const listLogsResponseSchema = createPaginatedSchema(logSchema, 'ListLogsResponse')
