import defineAction from '@core/factories/defineAction'
import userRepository from '@module/repositories/user'
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
  async ({ ids, manageError }: ManageRequestBody): ManageRequestResponse<ListLotteriesResponse> => {
    try {
      let userContext
      if (ids?.userId) {
        const user = await userRepository.findById(ids.userId)
        if (user) {
          userContext = { id: user.id, name: user.name, email: user.email }
        }
      }
      const lotteries = await fetchAllLotteries({ userContext })
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
  async ({ ids, params, query, manageError }: ManageRequestBody<LotteryParamsRequest>): ManageRequestResponse<LotteryItemResponse> => {
    try {
      let userContext
      if (ids?.userId) {
        const user = await userRepository.findById(ids.userId)
        if (user) {
          userContext = { id: user.id, name: user.name, email: user.email }
        }
      }

      const lottery = await fetchLotteryFromCaixa(params.type, query?.contestNumber, { userContext })

      if (!lottery) {
        return manageError({ code: 'not_found', details: 'Loteria ou concurso não encontrado na Caixa' })
      }

      return lottery
    } catch (error) {
      const err = error as any
      const errorMessage = err?.message || 'Falha ao comunicar com os servidores da Caixa Econômica Federal'
      return manageError({
        code: 'internal_error',
        error,
        details: errorMessage
      })
    }
  },
  { params: lotteryParamsSchema, query: lotteryQuerySchema }
)

