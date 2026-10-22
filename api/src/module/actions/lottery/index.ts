import defineAction from '@core/factories/defineAction'
import { fetchAllLotteries, fetchLotteryFromCaixa } from '@module/services/caixa'
import { listLotteriesResponseSchema, lotteryItemSchema, lotteryParamsSchema, lotteryQuerySchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'
import type { ListLotteriesResponse, LotteryItemResponse, LotteryParamsRequest } from './types'

export const listLotteries = defineAction(
  {
    method: 'get',
    path: '/iam/v1/lotteries',
    summary: 'Listar loterias e próximos concursos da Caixa',
    tags: ['Loterias - Caixa'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: listLotteriesResponseSchema }
    }
  },
  async ({ manageError }: ManageRequestBody): ManageRequestResponse<ListLotteriesResponse> => {
    try {
      const lotteries = await fetchAllLotteries()
      return lotteries
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const getLotteryByType = defineAction(
  {
    method: 'get',
    path: '/iam/v1/lotteries/{type}',
    summary: 'Buscar detalhes de uma loteria específica da Caixa',
    tags: ['Loterias - Caixa'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: lotteryItemSchema }
    }
  },
  async ({ params, query, manageError }: ManageRequestBody<LotteryParamsRequest>): ManageRequestResponse<LotteryItemResponse> => {
    try {
      const lottery = await fetchLotteryFromCaixa(params.type, query?.contestNumber)

      if (!lottery) {
        return manageError({ code: 'not_found', details: 'Loteria ou concurso não encontrado na Caixa' })
      }

      return lottery
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: lotteryParamsSchema, query: lotteryQuerySchema }
)
