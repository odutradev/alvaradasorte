import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const lotteryItemSchema = z.object({
  type: z.string().openapi({ example: 'megasena' }),
  name: z.string().openapi({ example: 'Mega-Sena' }),
  color: z.string().openapi({ example: '#209869' }),
  contestNumber: z.number().openapi({ example: 3072 }),
  nextContestNumber: z.number().openapi({ example: 3073 }),
  drawDate: z.string().nullable().openapi({ example: '2026-10-22T20:00:00.000Z' }),
  estimatedPrize: z.number().openapi({ example: 200000000 }),
  accumulatedPrize: z.number().openapi({ example: 187648868.43 }),
  isAccumulated: z.boolean().openapi({ example: true }),
  lastDrawnNumbers: z.array(z.string()).optional().openapi({ example: ['02', '06', '09', '16', '31', '40'] })
}).openapi('LotteryItemResponse')

export const listLotteriesResponseSchema = z.array(lotteryItemSchema).openapi('ListLotteriesResponse')

export const lotteryParamsSchema = z.object({
  type: z.string().openapi({ example: 'megasena' })
})

export const lotteryQuerySchema = z.object({
  contestNumber: z.coerce.number().int().positive().optional().openapi({ example: 3072 })
})
