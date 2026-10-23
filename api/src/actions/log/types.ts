import { z } from 'zod'

import { listLogsQuerySchema, listLogsResponseSchema, logSchema } from './schemas'

export type ListLogsRequest = { query: z.infer<typeof listLogsQuerySchema> }
export type ListLogsResponse = z.infer<typeof listLogsResponseSchema>
export type LogResponse = z.infer<typeof logSchema>
