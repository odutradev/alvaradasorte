import defineAction from '@core/factories/defineAction'
import userRepository from '@module/repositories/user/index'
import logRepository from '@module/repositories/log/index'
import { listLogsResponseSchema, listLogsQuerySchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'
import type { ListLogsRequest, ListLogsResponse } from './types'

export const listLogs = defineAction(
  {
    method: 'get',
    path: '/iam/v1/logs',
    summary: 'Listar logs (Usuário e Admin)',
    tags: ['IAM - Logs'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: listLogsResponseSchema }
    }
  },
  async ({ ids, query, manageError }: ManageRequestBody<ListLogsRequest>): ManageRequestResponse<ListLogsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const user = await userRepository.findById(ids.userId)
      if (!user) return manageError({ code: 'user_not_found' })

      const isAdmin = user.role === 'admin'

      // Se não for admin, o usuário só pode consultar os seus próprios logs de categoria 'user'
      const filters = {
        page: query?.page ? Number(query.page) : 1,
        limit: query?.limit ? Number(query.limit) : 20,
        category: isAdmin ? query?.category : 'user',
        level: isAdmin ? query?.level : undefined,
        userId: isAdmin ? query?.userId : user.id,
        search: query?.search
      }

      const logs = await logRepository.findAll(filters)

      return logs
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { query: listLogsQuerySchema }
)
