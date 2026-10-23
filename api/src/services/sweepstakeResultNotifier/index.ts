import { sweepstakeResultTemplate } from '@email/templates/sweepstakeResult'
import participationRepository from '@/repositories/participation'
import sweepstakeRepository from '@/repositories/sweepstake'
import userRepository from '@/repositories/user'
import logRepository from '@/repositories/log'
import createLogger from '@/utils/logger'

import type { ParticipationType } from '@/repositories/participation/types'
import type { SweepstakeType } from '@/repositories/sweepstake/types'
import type { UserType } from '@/repositories/user/types'

const logger = createLogger('sweepstakeResultNotifier')

export type SendResultEmailOptions = {
  triggeredBy?: 'auto_sync' | 'admin' | 'manual'
  adminUserId?: string
}

export type SendResultRoutineSummary = {
  sweepstakeId: string
  totalUsers: number
  sent: number
  skipped: number
  errors: number
}

export const buildSweepstakeEmailVariables = (
  sweepstake: SweepstakeType,
  allSweepstakeParticipations: ParticipationType[],
  user: UserType,
  userParticipations: ParticipationType[]
) => {
  const totalUserQuotas = userParticipations.reduce((sum, p) => sum + (p.quotaCount ?? 1), 0)
  const totalFilledQuotas = allSweepstakeParticipations.reduce((sum, p) => sum + (p.quotaCount ?? 1), 0)

  const drawnNumbersFormatted = (sweepstake.result || [])
    .map((n) => (n < 10 ? `0${n}` : String(n)))
    .join(' - ')

  const lotteryInfo = sweepstake.contestNumber
    ? `**Concurso:** ${sweepstake.contestNumber}${sweepstake.lotteryType ? ` (${sweepstake.lotteryType.toUpperCase()})` : ''}`
    : (sweepstake.lotteryType ? `**Modalidade:** ${sweepstake.lotteryType.toUpperCase()}` : '')

  const collectedValue = (totalFilledQuotas * sweepstake.quotaPrice).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  const prizeValue = sweepstake.prizeValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  const resultSet = new Set(sweepstake.result || [])
  let gamesList = '_Nenhum jogo cadastrado no bolão._'

  if (sweepstake.games && sweepstake.games.length > 0) {
    gamesList = sweepstake.games
      .map((game, idx) => {
        const sortedGame = [...game].sort((a, b) => a - b)
        const matched = sortedGame.filter((n) => resultSet.has(n))
        const hits = matched.length
        const formattedNums = sortedGame
          .map((n) => {
            const formatted = n < 10 ? `0${n}` : String(n)
            return resultSet.has(n) ? `**${formatted}**` : formatted
          })
          .join(' - ')

        const hitsDescription =
          hits > 0
            ? `🎯 **${hits} ${hits === 1 ? 'acerto' : 'acertos'}** (dezena(s): **${matched.map((n) => (n < 10 ? `0${n}` : String(n))).join(', ')}**)`
            : '⚪ Nenhum acerto'

        return `- **Jogo ${idx + 1}** (${sortedGame.length} dezenas): ${hitsDescription}\n  - Dezenas: ${formattedNums}`
      })
      .join('\n\n')
  }

  const fallbackName = userParticipations[0]?.userName || 'Participante'
  const userName = user.fullName || user.name || fallbackName

  return {
    userName,
    sweepstakeTitle: sweepstake.title,
    drawnNumbers: drawnNumbersFormatted,
    lotteryInfo,
    quotaCount: totalUserQuotas,
    quotaLabel: totalUserQuotas === 1 ? 'cota' : 'cotas',
    collectedValue,
    prizeValue,
    gamesList
  }
}

export const sendResultEmailToParticipantGroup = async (
  sweepstake: SweepstakeType,
  allSweepstakeParticipations: ParticipationType[],
  user: UserType,
  userParticipations: ParticipationType[],
  options?: SendResultEmailOptions
): Promise<{ success: boolean; error?: string }> => {
  if (!user.email) {
    return { success: false, error: 'Usuário sem e-mail cadastrado' }
  }

  const variables = buildSweepstakeEmailVariables(
    sweepstake,
    allSweepstakeParticipations,
    user,
    userParticipations
  )

  const emailResult = await sweepstakeResultTemplate.send({
    to: user.email,
    variables
  })

  if (!emailResult.success) {
    return { success: false, error: emailResult.error || 'Falha no envio do e-mail' }
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

  const totalUserQuotas = userParticipations.reduce((sum, p) => sum + (p.quotaCount ?? 1), 0)

  logRepository.create({
    category: 'admin',
    level: 'info',
    action: 'EMAIL_RESULT_SENT',
    title: 'E-mail de resultado enviado (unificado)',
    description: `E-mail de resultado do bolão "${sweepstake.title}" enviado para ${user.email} (${variables.userName}) cobrindo ${totalUserQuotas} cota(s) em ${userParticipations.length} registro(s)`,
    userId: options?.adminUserId || 'system',
    targetId: sweepstake.id,
    details: {
      source: options?.triggeredBy || 'system',
      userEmail: user.email,
      totalQuotas: totalUserQuotas,
      participationsCount: userParticipations.length
    }
  })

  return { success: true }
}

export const sendSweepstakeResultEmailsRoutine = async (
  sweepstakeId: string,
  options?: SendResultEmailOptions
): Promise<SendResultRoutineSummary> => {
  const summary: SendResultRoutineSummary = {
    sweepstakeId,
    totalUsers: 0,
    sent: 0,
    skipped: 0,
    errors: 0
  }

  logger.info(`[sweepstakeResultNotifier] Iniciando rotina de envio de resultados para o bolão ID: ${sweepstakeId} (origem: ${options?.triggeredBy || 'system'})`)

  const sweepstake = await sweepstakeRepository.findById(sweepstakeId)
  if (!sweepstake) {
    logger.warn(`[sweepstakeResultNotifier] Bolão não encontrado: ${sweepstakeId}`)
    return summary
  }

  if (!sweepstake.result || sweepstake.result.length === 0) {
    logger.warn(`[sweepstakeResultNotifier] Bolão "${sweepstake.title}" (ID: ${sweepstakeId}) não possui resultado apurado. Cancelando envio.`)
    return summary
  }

  const allParticipations = await participationRepository.findBySweepstakeId(sweepstakeId)
  if (!allParticipations || allParticipations.length === 0) {
    logger.info(`[sweepstakeResultNotifier] Bolão "${sweepstake.title}" não possui participações registradas.`)
    return summary
  }

  const usersResponse = await userRepository.findAll({ limit: 1000 })
  const allUsers = usersResponse.data || []
  const userMapById = new Map<string, UserType>()
  const userMapByName = new Map<string, UserType>()

  for (const user of allUsers) {
    if (user.id) userMapById.set(user.id, user)
    if (user.name) userMapByName.set(user.name.toLowerCase(), user)
    if (user.fullName) userMapByName.set(user.fullName.toLowerCase(), user)
  }

  const userGroupMap = new Map<
    string,
    { user: UserType; participations: ParticipationType[] }
  >()

  for (const participation of allParticipations) {
    let resolvedUser: UserType | null = null

    if (participation.userId && userMapById.has(participation.userId)) {
      resolvedUser = userMapById.get(participation.userId)!
    } else if (participation.userName) {
      const normalizedName = participation.userName.toLowerCase()
      if (userMapByName.has(normalizedName)) {
        resolvedUser = userMapByName.get(normalizedName)!
      }
    }

    if (!resolvedUser && participation.userId) {
      resolvedUser = await userRepository.findById(participation.userId)
      if (resolvedUser?.id) {
        userMapById.set(resolvedUser.id, resolvedUser)
      }
    }

    if (!resolvedUser || !resolvedUser.email) {
      logger.warn(
        `[sweepstakeResultNotifier] Participante "${participation.userName}" (participação: ${participation.id}) sem usuário ou e-mail correspondente. Ignorado.`
      )
      summary.skipped += 1
      continue
    }

    const groupKey = resolvedUser.id || resolvedUser.email
    const existingGroup = userGroupMap.get(groupKey)

    if (existingGroup) {
      existingGroup.participations.push(participation)
    } else {
      userGroupMap.set(groupKey, {
        user: resolvedUser,
        participations: [participation]
      })
    }
  }

  summary.totalUsers = userGroupMap.size

  for (const [, group] of userGroupMap) {
    const { user, participations } = group

    if (user.notifySweepstakeResult === false) {
      logger.info(
        `[sweepstakeResultNotifier] Usuário ${user.email} optou por não receber e-mails de resultado. Ignorado.`
      )
      summary.skipped += 1
      continue
    }

    const allAlreadySent = participations.every((p) => p.resultEmailSent)
    if (allAlreadySent) {
      logger.info(
        `[sweepstakeResultNotifier] E-mail de resultado já enviado para todas as cotas de ${user.email}. Ignorado.`
      )
      summary.skipped += 1
      continue
    }

    try {
      const sendResult = await sendResultEmailToParticipantGroup(
        sweepstake,
        allParticipations,
        user,
        participations,
        options
      )

      if (sendResult.success) {
        summary.sent += 1
        logger.info(
          `[sweepstakeResultNotifier] E-mail enviado com sucesso para ${user.email} (${participations.length} participações).`
        )
      } else {
        summary.errors += 1
        logger.error(
          `[sweepstakeResultNotifier] Erro ao enviar e-mail para ${user.email}: ${sendResult.error}`
        )
      }
    } catch (sendError) {
      summary.errors += 1
      logger.error(
        `[sweepstakeResultNotifier] Exceção ao enviar e-mail para ${user.email}`,
        sendError
      )
    }
  }

  logger.info(
    `[sweepstakeResultNotifier] Concluída rotina para bolão "${sweepstake.title}". Total: ${summary.totalUsers} usuários | Enviados: ${summary.sent} | Ignorados: ${summary.skipped} | Erros: ${summary.errors}`
  )

  return summary
}

