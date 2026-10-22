import { sendResultEmailParamsSchema, updateParticipationBodySchema, deleteParticipationParamsSchema, addManualParticipationBodySchema, listSweepstakesResponseSchema, listSweepstakesQuerySchema, setSweepstakeResultSchema, addSweepstakeGamesSchema, sweepstakeDetailsSchema, updateSweepstakeSchema, createSweepstakeSchema, sweepstakeParamsSchema, joinSweepstakeBodySchema, participationSchema, sweepstakeSchema } from './schemas'
import { sweepstakeResultTemplate } from '@email/templates/sweepstakeResult'
import participationRepository from '@module/repositories/participation/index'
import sweepstakeRepository from '@module/repositories/sweepstake/index'
import userRepository from '@module/repositories/user/index'
import logRepository from '@module/repositories/log/index'
import { firebaseStorage } from '@core/database/connection'
import defineAction from '@core/factories/defineAction'
import upload from '@core/middlewares/upload'
import { isPast } from '@core/utils/date'

import type { SendResultEmailRequest, UpdateParticipationRequest, AddManualParticipationRequest, DeleteParticipationRequest, SetSweepstakeResultRequest, AddSweepstakeGamesRequest, SweepstakeDetailsResponse, DeleteSweepstakeRequest, UpdateSweepstakeRequest, CreateSweepstakeRequest, SweepstakeParamsRequest, ListSweepstakesResponse, ListSweepstakesRequest, JoinSweepstakeRequest, ParticipationResponse, SweepstakeResponse } from './types'
import type { ParticipationType } from '@module/repositories/participation/types'
import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'

export const listSweepstakes = defineAction(
  {
    method: 'get',
    path: '/iam/v1/sweepstakes',
    summary: 'Listar bolões disponíveis',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: listSweepstakesResponseSchema }
    }
  },
  async ({ ids, query, manageError }: ManageRequestBody<ListSweepstakesRequest>): ManageRequestResponse<ListSweepstakesResponse> => {
    try {
      const [sweepstakes, participations] = await Promise.all([
        sweepstakeRepository.findAll(),
        participationRepository.findAll()
      ])

      const targetUserId = query?.userId ?? ids.userId

      const mappedSweepstakes = sweepstakes.map((sweepstake) => {
        const sweepstakeParticipations = participations.filter((p) => p.sweepstakeId === sweepstake.id)
        const filledQuotas = sweepstakeParticipations.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0)

        const userParticipations = targetUserId
          ? sweepstakeParticipations.filter((p) => p.userId === targetUserId)
          : []

        const isParticipant = userParticipations.length > 0
        const userQuotaCount = userParticipations.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0)
        const firstJoinedAt = isParticipant
          ? userParticipations.reduce((oldest, p) => (p.createdAt < oldest ? p.createdAt : oldest), userParticipations[0].createdAt)
          : null

        const userParticipation = targetUserId
          ? {
              isParticipant,
              quotaCount: userQuotaCount,
              joinedAt: firstJoinedAt
            }
          : undefined

        return {
          ...sweepstake,
          metadata: {
            filledQuotas
          },
          ...(userParticipation && { userParticipation })
        }
      })

      return mappedSweepstakes
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { query: listSweepstakesQuerySchema }
)

export const createSweepstake = defineAction(
  {
    method: 'post',
    path: '/iam/v1/sweepstakes',
    summary: 'Criar bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<CreateSweepstakeRequest>): ManageRequestResponse<SweepstakeResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const payload = { ...data, adminId: ids.userId }
      const sweepstake = await sweepstakeRepository.create(payload)

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'SWEEPSTAKE_CREATE',
        title: 'Bolão criado',
        description: `Bolão "${sweepstake.title}" foi criado`,
        userId: ids.userId,
        targetId: sweepstake.id,
        targetName: sweepstake.title,
        details: { quotaPrice: sweepstake.quotaPrice, availableQuotas: sweepstake.availableQuotas }
      })

      return sweepstake
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: createSweepstakeSchema }
)

export const updateSweepstake = defineAction(
  {
    method: 'patch',
    path: '/iam/v1/sweepstakes/{id}',
    summary: 'Atualizar bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeSchema }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<UpdateSweepstakeRequest>): ManageRequestResponse<SweepstakeResponse> => {
    try {
      const sweepstake = await sweepstakeRepository.update(params.id, data)

      if (!sweepstake) return manageError({ code: 'not_found' })

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'SWEEPSTAKE_UPDATE',
        title: 'Bolão atualizado',
        description: `Bolão "${sweepstake.title}" teve configurações alteradas`,
        userId: ids.userId,
        targetId: params.id,
        targetName: sweepstake.title,
        details: data
      })

      return sweepstake
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema, body: updateSweepstakeSchema }
)

export const deleteSweepstake = defineAction(
  {
    method: 'delete',
    path: '/iam/v1/sweepstakes/{id}',
    summary: 'Remover bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<DeleteSweepstakeRequest>): ManageRequestResponse => {
    try {
      const sweepstake = await sweepstakeRepository.findById(params.id)
      const deleted = await sweepstakeRepository.delete(params.id)

      if (!deleted) return manageError({ code: 'not_found' })

      logRepository.create({
        category: 'admin',
        level: 'warn',
        action: 'SWEEPSTAKE_DELETE',
        title: 'Bolão excluído',
        description: `Bolão "${sweepstake?.title || params.id}" foi removido do sistema`,
        userId: ids.userId,
        targetId: params.id,
        targetName: sweepstake?.title
      })
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema }
)

export const getSweepstakeDetails = defineAction(
  {
    method: 'get',
    path: '/iam/v1/sweepstakes/{id}/details',
    summary: 'Detalhes completos do bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeDetailsSchema }
    }
  },
  async ({ params, manageError }: ManageRequestBody<SweepstakeParamsRequest>): ManageRequestResponse<SweepstakeDetailsResponse> => {
    try {
      const [sweepstake, participations] = await Promise.all([
        sweepstakeRepository.findById(params.id),
        participationRepository.findBySweepstakeId(params.id)
      ])

      if (!sweepstake) return manageError({ code: 'not_found' })

      const bucket = firebaseStorage.bucket()
      const participationsWithDetails = await Promise.all(
        participations.map(async (p) => {
          let receiptUrl = p.receiptUrl
          if (p.receiptUrl) {
            try {
              const [signedUrl] = await bucket.file(p.receiptUrl).getSignedUrl({
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000
              })
              receiptUrl = signedUrl
            } catch {}
          }

          let userPhotoUrl = p.userPhotoUrl
          if (p.userId) {
            try {
              const user = await userRepository.findById(p.userId)
              if (user?.photoUrl) userPhotoUrl = user.photoUrl
            } catch {}
          }

          return { ...p, receiptUrl, userPhotoUrl }
        })
      )

      return { ...sweepstake, participations: participationsWithDetails }
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema }
)

const inFlightJoins = new Set<string>()

export const joinSweepstake = defineAction(
  {
    method: 'post',
    path: '/iam/v1/sweepstakes/{id}/join',
    summary: 'Entrar em um bolão',
    tags: ['IAM - Bolões'],
    authenticate: true,
    middlewares: [upload.single('receipt')],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              receipt: { type: 'string', format: 'binary' },
              quotaCount: { type: 'integer', minimum: 1, default: 1 },
              suggestedNumbers: { type: 'string', description: 'JSON array or comma separated integers' }
            }
          }
        }
      }
    },
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ ids, params, data, file, manageError }: ManageRequestBody<JoinSweepstakeRequest>): ManageRequestResponse => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })
    if (!file) {
      logRepository.create({
        category: 'system',
        level: 'warn',
        action: 'SWEEPSTAKE_JOIN_FAILED',
        title: 'Tentativa de participação sem comprovante',
        description: 'Usuário tentou participar sem anexar o comprovante',
        userId: ids.userId,
        targetId: params.id
      })
      return manageError({ code: 'bad_request', details: 'Comprovante não enviado' })
    }

    const lockKey = `${ids.userId}:${params.id}`
    if (inFlightJoins.has(lockKey)) {
      return manageError({ code: 'bad_request', details: 'Uma solicitação de compra para este bolão já está sendo processada. Por favor, aguarde.' })
    }

    inFlightJoins.add(lockKey)

    const requestedQuotaCount = data?.quotaCount ?? 1

    try {
      const [user, sweepstake, participations] = await Promise.all([
        userRepository.findById(ids.userId),
        sweepstakeRepository.findById(params.id),
        participationRepository.findBySweepstakeId(params.id)
      ])

      if (!user) return manageError({ code: 'user_not_found' })
      if (!sweepstake) return manageError({ code: 'not_found' })

      const now = Date.now()
      const recentDuplicate = participations.find((p) => {
        if (p.userId !== user.id || !p.createdAt) return false
        const diffMs = now - new Date(p.createdAt).getTime()
        return diffMs >= 0 && diffMs < 10000
      })

      if (recentDuplicate) {
        logRepository.create({
          category: 'system',
          level: 'warn',
          action: 'SWEEPSTAKE_JOIN_FAILED',
          title: 'Tentativa de compra duplicada prevenida',
          description: `Tentativa de compra duplicada evitada para o usuário ${user.email} no bolão "${sweepstake.title}"`,
          userId: user.id,
          userName: user.fullName || user.name,
          userEmail: user.email,
          targetId: sweepstake.id,
          targetName: sweepstake.title
        })
        return manageError({ code: 'bad_request', details: 'Uma cota acabou de ser registrada para você neste bolão. Por favor, aguarde alguns instantes.' })
      }

      const missingProfileInfo = !user.fullName || !user.department || !user.phone

      if (missingProfileInfo) {
        logRepository.create({
          category: 'system',
          level: 'warn',
          action: 'SWEEPSTAKE_JOIN_FAILED',
          title: 'Perfil incompleto na compra de cota',
          description: `Usuário ${user.email} tentou participar do bolão "${sweepstake.title}" com perfil incompleto`,
          userId: user.id,
          userName: user.fullName || user.name,
          userEmail: user.email,
          targetId: sweepstake.id,
          targetName: sweepstake.title
        })
        return manageError({ code: 'bad_request', details: 'Perfil incompleto. Preencha nome completo, setor e telefone.' })
      }

      const isClosed = isPast(new Date(sweepstake.purchaseLimitDate))

      if (isClosed) {
        logRepository.create({
          category: 'system',
          level: 'warn',
          action: 'SWEEPSTAKE_JOIN_FAILED',
          title: 'Tentativa de compra após prazo limite',
          description: `Tentativa de compra de cota no bolão "${sweepstake.title}" após a data limite (${sweepstake.purchaseLimitDate})`,
          userId: user.id,
          userName: user.fullName || user.name,
          userEmail: user.email,
          targetId: sweepstake.id,
          targetName: sweepstake.title
        })
        return manageError({ code: 'bad_request', details: 'Data limite para compra excedida' })
      }

      const currentFilledQuotas = participations.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0)
      const remainingQuotas = sweepstake.availableQuotas - currentFilledQuotas

      if (remainingQuotas <= 0) {
        logRepository.create({
          category: 'system',
          level: 'warn',
          action: 'SWEEPSTAKE_JOIN_FAILED',
          title: 'Tentativa de compra em bolão esgotado',
          description: `Usuário tentou comprar cota no bolão "${sweepstake.title}", mas as cotas estão esgotadas (${currentFilledQuotas}/${sweepstake.availableQuotas})`,
          userId: user.id,
          userName: user.fullName || user.name,
          userEmail: user.email,
          targetId: sweepstake.id,
          targetName: sweepstake.title
        })
        return manageError({ code: 'bad_request', details: 'Cotas esgotadas' })
      }

      if (requestedQuotaCount > remainingQuotas) {
        logRepository.create({
          category: 'system',
          level: 'warn',
          action: 'SWEEPSTAKE_JOIN_FAILED',
          title: 'Tentativa de compra acima do saldo de cotas',
          description: `Tentativa de adquirir ${requestedQuotaCount} cota(s) quando restam apenas ${remainingQuotas} no bolão "${sweepstake.title}"`,
          userId: user.id,
          userName: user.fullName || user.name,
          userEmail: user.email,
          targetId: sweepstake.id,
          targetName: sweepstake.title
        })
        return manageError({ code: 'bad_request', details: `Apenas ${remainingQuotas} cota(s) disponível(is)` })
      }

      const bucket = firebaseStorage.bucket()
      const fileExtension = file.originalname.split('.').pop()
      const filePath = `receipts/${params.id}/${ids.userId}-${Date.now()}.${fileExtension}`
      const fileRef = bucket.file(filePath)

      await fileRef.save(file.buffer, { metadata: { contentType: file.mimetype } })

      const payload = {
        sweepstakeId: params.id,
        userId: user.id,
        userName: user.fullName as string,
        userPhone: user.phone as string,
        userDepartment: user.department as string,
        receiptUrl: filePath,
        quotaCount: requestedQuotaCount,
        ...(data.suggestedNumbers && data.suggestedNumbers.length > 0 && { suggestedNumbers: data.suggestedNumbers })
      }

      await participationRepository.create(payload)

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'SWEEPSTAKE_JOIN',
        title: 'Cota adquirida com sucesso',
        description: `${user.fullName} adquiriu ${requestedQuotaCount} cota(s) no bolão "${sweepstake.title}"`,
        userId: user.id,
        userName: user.fullName as string,
        userEmail: user.email,
        targetId: sweepstake.id,
        targetName: sweepstake.title,
        details: {
          quotaCount: requestedQuotaCount,
          totalPrice: requestedQuotaCount * sweepstake.quotaPrice,
          suggestedNumbers: data.suggestedNumbers
        }
      })
    } catch (error: any) {
      logRepository.create({
        category: 'system',
        level: 'error',
        action: 'SWEEPSTAKE_JOIN_ERROR',
        title: 'Erro no cadastramento de cotas do bolão',
        description: `Falha interna ao processar comprovante ou registrar cota no bolão ID ${params.id}`,
        userId: ids.userId,
        targetId: params.id,
        errorMessage: error?.message || 'Erro desconhecido',
        errorStack: error?.stack,
        details: { requestedQuotaCount }
      })
      return manageError({ code: 'internal_error', error })
    } finally {
      inFlightJoins.delete(lockKey)
    }
  },
  { params: sweepstakeParamsSchema, body: joinSweepstakeBodySchema }
)

export const addSweepstakeGames = defineAction(
  {
    method: 'patch',
    path: '/iam/v1/sweepstakes/{id}/games',
    summary: 'Definir jogos do bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeSchema }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<AddSweepstakeGamesRequest>): ManageRequestResponse<SweepstakeResponse> => {
    try {
      const sweepstake = await sweepstakeRepository.findById(params.id)

      if (!sweepstake) return manageError({ code: 'not_found' })

      const updated = await sweepstakeRepository.update(params.id, { games: data.games })

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'SWEEPSTAKE_GAMES_UPDATE',
        title: 'Jogos do bolão configurados',
        description: `Admin definiu ${data.games.length} jogo(s) no bolão "${sweepstake.title}"`,
        userId: ids.userId,
        targetId: params.id,
        targetName: sweepstake.title,
        details: { gamesCount: data.games.length }
      })

      return updated!
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema, body: addSweepstakeGamesSchema }
)

export const setSweepstakeResult = defineAction(
  {
    method: 'patch',
    path: '/iam/v1/sweepstakes/{id}/result',
    summary: 'Definir resultado do bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: sweepstakeSchema }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<SetSweepstakeResultRequest>): ManageRequestResponse<SweepstakeResponse> => {
    try {
      const sweepstake = await sweepstakeRepository.findById(params.id)

      if (!sweepstake) return manageError({ code: 'not_found' })

      const updated = await sweepstakeRepository.update(params.id, { result: data.result })

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'SWEEPSTAKE_RESULT_SET',
        title: 'Resultado do bolão apurado',
        description: `Admin registrou o resultado sorteado do bolão "${sweepstake.title}"`,
        userId: ids.userId,
        targetId: params.id,
        targetName: sweepstake.title,
        details: { result: data.result }
      })

      return updated!
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema, body: setSweepstakeResultSchema }
)

export const addManualParticipation = defineAction(
  {
    method: 'post',
    path: '/iam/v1/sweepstakes/{id}/participations/manual',
    summary: 'Adicionar participação manualmente (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: participationSchema }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<AddManualParticipationRequest>): ManageRequestResponse<ParticipationResponse> => {
    try {
      const user = await userRepository.findByEmail(data.email)

      if (!user) return manageError({ code: 'bad_request', details: 'Usuário não encontrado com este e-mail' })

      const [sweepstake, participations] = await Promise.all([
        sweepstakeRepository.findById(params.id),
        participationRepository.findBySweepstakeId(params.id)
      ])

      if (!sweepstake) return manageError({ code: 'not_found' })

      const requestedQuotaCount = data.quotaCount ?? 1
      const currentFilledQuotas = participations.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0)
      const remainingQuotas = sweepstake.availableQuotas - currentFilledQuotas

      if (remainingQuotas <= 0) return manageError({ code: 'bad_request', details: 'Cotas esgotadas para este bolão' })
      if (requestedQuotaCount > remainingQuotas) return manageError({ code: 'bad_request', details: `Apenas ${remainingQuotas} cota(s) disponível(is)` })

      const now = Date.now()
      const recentDuplicate = participations.find((p) => {
        if (p.userId !== user.id || !p.createdAt) return false
        const diffMs = now - new Date(p.createdAt).getTime()
        return diffMs >= 0 && diffMs < 10000
      })

      if (recentDuplicate) {
        return manageError({ code: 'bad_request', details: 'Uma participação acabou de ser registrada para este usuário neste bolão. Aguarde alguns instantes.' })
      }

      const payload = {
        sweepstakeId: params.id,
        userId: user.id,
        userName: (user.fullName || user.name || user.email) as string,
        userPhone: (user.phone || '') as string,
        userDepartment: (user.department || '') as string,
        receiptUrl: '',
        quotaCount: requestedQuotaCount,
        ...(data.suggestedNumbers && data.suggestedNumbers.length > 0 && { suggestedNumbers: data.suggestedNumbers })
      }

      const participation = await participationRepository.create(payload)

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'MANUAL_PARTICIPATION_ADD',
        title: 'Participação manual adicionada',
        description: `Admin inseriu participação de ${payload.userName} (${requestedQuotaCount} cota(s)) no bolão "${sweepstake.title}"`,
        userId: ids.userId,
        targetId: params.id,
        targetName: sweepstake.title,
        details: { participantUserId: user.id, quotaCount: requestedQuotaCount, email: data.email }
      })

      return participation
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sweepstakeParamsSchema, body: addManualParticipationBodySchema }
)

export const deleteParticipation = defineAction(
  {
    method: 'delete',
    path: '/iam/v1/sweepstakes/{id}/participations/{participationId}',
    summary: 'Remover participação de bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<DeleteParticipationRequest>): ManageRequestResponse => {
    try {
      const participation = await participationRepository.findById(params.participationId)

      if (!participation || participation.sweepstakeId !== params.id) {
        return manageError({ code: 'not_found' })
      }

      await participationRepository.delete(params.participationId)

      logRepository.create({
        category: 'admin',
        level: 'warn',
        action: 'PARTICIPATION_DELETE',
        title: 'Participação removida',
        description: `Admin removeu a participação de ${participation.userName} no bolão ID ${params.id}`,
        userId: ids.userId,
        targetId: params.id,
        details: { participationId: params.participationId, userName: participation.userName }
      })
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: deleteParticipationParamsSchema }
)

export const updateParticipation = defineAction(
  {
    method: 'patch',
    path: '/iam/v1/sweepstakes/{id}/participations/{participationId}',
    summary: 'Atualizar participação de bolão (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: participationSchema }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<UpdateParticipationRequest>): ManageRequestResponse<ParticipationResponse> => {
    try {
      const participation = await participationRepository.findById(params.participationId)

      if (!participation || participation.sweepstakeId !== params.id) {
        return manageError({ code: 'not_found' })
      }

      if (data.quotaCount !== undefined && data.quotaCount !== participation.quotaCount) {
        const [sweepstake, participations] = await Promise.all([
          sweepstakeRepository.findById(params.id),
          participationRepository.findBySweepstakeId(params.id)
        ])

        if (!sweepstake) return manageError({ code: 'not_found' })

        const currentFilledQuotas = participations.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0)
        const newTotalQuotas = currentFilledQuotas - participation.quotaCount + data.quotaCount

        if (newTotalQuotas > sweepstake.availableQuotas) {
          const maxAllowed = sweepstake.availableQuotas - (currentFilledQuotas - participation.quotaCount)
          return manageError({ code: 'bad_request', details: `Apenas ${maxAllowed} cota(s) disponível(is) para esta alteração` })
        }
      }

      const updateData: Partial<ParticipationType> = {}
      if (data.quotaCount !== undefined) updateData.quotaCount = data.quotaCount
      if (data.userName !== undefined) updateData.userName = data.userName
      if (data.userDepartment !== undefined) updateData.userDepartment = data.userDepartment
      if (data.userPhone !== undefined) updateData.userPhone = data.userPhone
      if (data.suggestedNumbers !== undefined) updateData.suggestedNumbers = data.suggestedNumbers

      const updatedParticipation = await participationRepository.update(params.participationId, updateData)

      if (participation.userId && (data.userName || data.userDepartment || data.userPhone)) {
        await userRepository.update(participation.userId, {
          ...(data.userName && { name: data.userName, fullName: data.userName }),
          ...(data.userDepartment && { department: data.userDepartment }),
          ...(data.userPhone && { phone: data.userPhone })
        })
      }

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'PARTICIPATION_UPDATE',
        title: 'Participação atualizada',
        description: `Admin alterou dados da participação de ${participation.userName} no bolão ID ${params.id}`,
        userId: ids.userId,
        targetId: params.id,
        details: { participationId: params.participationId, changes: data }
      })

      return updatedParticipation!
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: deleteParticipationParamsSchema, body: updateParticipationBodySchema }
)

export const sendParticipationResultEmail = defineAction(
  {
    method: 'post',
    path: '/iam/v1/sweepstakes/{id}/participations/{participationId}/send-result-email',
    summary: 'Enviar e-mail com resultado do bolão para participante (Admin)',
    tags: ['IAM - Bolões'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: participationSchema }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<SendResultEmailRequest>): ManageRequestResponse<ParticipationResponse> => {
    try {
      const [sweepstake, participation] = await Promise.all([
        sweepstakeRepository.findById(params.id),
        participationRepository.findById(params.participationId)
      ])

      if (!sweepstake) return manageError({ code: 'not_found', details: 'Bolão não encontrado' })
      if (!participation || participation.sweepstakeId !== params.id) {
        return manageError({ code: 'not_found', details: 'Participação não encontrada neste bolão' })
      }

      if (!sweepstake.result || sweepstake.result.length === 0) {
        return manageError({ code: 'bad_request', details: 'O bolão ainda não possui resultado apurado' })
      }

      const allSweepstakeParticipations = await participationRepository.findBySweepstakeId(params.id)

      let user = participation.userId ? await userRepository.findById(participation.userId) : null
      if (!user && participation.userName) {
        const allUsers = await userRepository.findAll({ limit: 500 })
        user = allUsers.data.find((u) => u.name === participation.userName || u.fullName === participation.userName) ?? null
      }

      if (!user || !user.email) {
        return manageError({ code: 'bad_request', details: 'Usuário participante não encontrado ou sem e-mail cadastrado' })
      }

      if (user.notifySweepstakeResult === false) {
        return manageError({ code: 'bad_request', details: 'O participante optou por não receber notificações de resultado por e-mail' })
      }

      const userParticipations = allSweepstakeParticipations.filter(
        (p) => p.userId === participation.userId || (p.userId === user?.id)
      )

      const allAlreadySent = userParticipations.length > 0 && userParticipations.every((p) => p.resultEmailSent)
      if (allAlreadySent) {
        return manageError({ code: 'conflict', details: 'O e-mail de resultado já foi enviado para todas as cotas deste participante' })
      }

      const totalUserQuotas = userParticipations.reduce((sum, p) => sum + (p.quotaCount ?? 1), 0)

      const drawnNumbersFormatted = sweepstake.result
        .map((n) => (n < 10 ? `0${n}` : String(n)))
        .join(' - ')

      const lotteryInfo = sweepstake.contestNumber
        ? `**Concurso:** ${sweepstake.contestNumber}${sweepstake.lotteryType ? ` (${sweepstake.lotteryType.toUpperCase()})` : ''}`
        : (sweepstake.lotteryType ? `**Modalidade:** ${sweepstake.lotteryType.toUpperCase()}` : '')

      const totalFilledQuotas = allSweepstakeParticipations.reduce((sum, p) => sum + (p.quotaCount ?? 1), 0)
      const collectedValue = (totalFilledQuotas * sweepstake.quotaPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      const prizeValue = sweepstake.prizeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

      const resultSet = new Set(sweepstake.result)
      let gamesList = '_Nenhum jogo cadastrado no bolão._'
      if (sweepstake.games && sweepstake.games.length > 0) {
        gamesList = sweepstake.games.map((game, idx) => {
          const hits = game.filter((n) => resultSet.has(n)).length
          const formattedNums = game.map((n) => {
            const formatted = n < 10 ? `0${n}` : String(n)
            return resultSet.has(n) ? `**${formatted}**` : formatted
          }).join(', ')
          return `- **Jogo ${idx + 1}:** [ ${formattedNums} ] — _${hits} ${hits === 1 ? 'acerto' : 'acertos'}_`
        }).join('\n')
      }

      const emailResult = await sweepstakeResultTemplate.send({
        to: user.email,
        variables: {
          userName: user.fullName || user.name || participation.userName,
          sweepstakeTitle: sweepstake.title,
          drawnNumbers: drawnNumbersFormatted,
          lotteryInfo,
          quotaCount: totalUserQuotas,
          quotaLabel: totalUserQuotas === 1 ? 'cota' : 'cotas',
          collectedValue,
          prizeValue,
          gamesList
        }
      })

      if (!emailResult.success) {
        return manageError({ code: 'internal_error', details: emailResult.error ?? 'Falha ao enviar e-mail' })
      }

      const now = new Date().toISOString()

      await Promise.all(
        userParticipations.map((p) =>
          participationRepository.update(p.id, {
            resultEmailSent: true,
            resultEmailSentAt: now
          })
        )
      )

      logRepository.create({
        category: 'admin',
        level: 'info',
        action: 'EMAIL_RESULT_SENT',
        title: 'E-mail de resultado enviado (unificado)',
        description: `E-mail de resultado do bolão "${sweepstake.title}" enviado para ${user.email} (${participation.userName}) cobrindo ${totalUserQuotas} cota(s) em ${userParticipations.length} registro(s)`,
        userId: ids.userId,
        targetId: params.id,
        details: {
          participationId: params.participationId,
          userEmail: user.email,
          totalQuotas: totalUserQuotas,
          participationsCount: userParticipations.length
        }
      })

      const updatedCurrent = await participationRepository.findById(params.participationId)
      return updatedCurrent!
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: sendResultEmailParamsSchema }
)