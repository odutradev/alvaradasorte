import type { z } from 'zod'
import type { lotteryItemSchema, listLotteriesResponseSchema, lotteryParamsSchema } from './schemas'

export type LotteryItemResponse = z.infer<typeof lotteryItemSchema>
export type ListLotteriesResponse = z.infer<typeof listLotteriesResponseSchema>
export type LotteryParamsRequest = { params: z.infer<typeof lotteryParamsSchema> }
