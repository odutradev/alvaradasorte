import sweepstakeRepository from '@module/repositories/sweepstake'
import { sendSweepstakeResultEmailsRoutine } from '@module/services/sweepstakeResultNotifier'
import { fetchLotteryFromCaixa } from '@module/services/caixa'
import createLogger from '@core/utils/logger'

import type { SweepstakeType, ResultSyncAttempt, ResultSyncLog } from '@module/repositories/sweepstake/types'

const logger = createLogger('autoResultSync')

export const INITIAL_DELAY_MS = 15 * 60 * 1000
export const RETRY_INTERVAL_MS = 10 * 60 * 1000
export const MAX_ATTEMPTS = 6
const CHECK_INTERVAL_MS = 60 * 1000

let isRunning = false
let syncIntervalTimer: NodeJS.Timeout | null = null

export const isSweepstakeClosed = (sweepstake: SweepstakeType, now: number): boolean => {
  if (sweepstake.purchaseLimitDate) {
    const purchaseLimitTime = new Date(sweepstake.purchaseLimitDate).getTime()
    if (!Number.isNaN(purchaseLimitTime) && now >= purchaseLimitTime) {
      return true
    }
  }

  if (sweepstake.drawDate) {
    const drawTime = new Date(sweepstake.drawDate).getTime()
    if (!Number.isNaN(drawTime) && now >= drawTime) {
      return true
    }
  }

  return false
}

export const shouldAttemptResultSync = (
  sweepstake: SweepstakeType,
  now: number
): { shouldRun: boolean; attemptNumber: number } => {
  if (sweepstake.result && sweepstake.result.length > 0) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  if (!sweepstake.lotteryType) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  if (!sweepstake.drawDate) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  const drawTime = new Date(sweepstake.drawDate).getTime()
  if (Number.isNaN(drawTime)) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  if (!isSweepstakeClosed(sweepstake, now)) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  const firstAttemptTime = drawTime + INITIAL_DELAY_MS
  if (now < firstAttemptTime) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  const syncLog = sweepstake.resultSyncLog

  if (syncLog?.status === 'success') {
    return { shouldRun: false, attemptNumber: 0 }
  }

  const currentAttempts = syncLog?.attemptsCount ?? 0

  if (currentAttempts >= MAX_ATTEMPTS) {
    return { shouldRun: false, attemptNumber: 0 }
  }

  if (currentAttempts === 0) {
    return { shouldRun: true, attemptNumber: 1 }
  }

  if (syncLog?.lastAttemptAt) {
    const lastAttemptTime = new Date(syncLog.lastAttemptAt).getTime()
    if (!Number.isNaN(lastAttemptTime)) {
      const nextAttemptTime = lastAttemptTime + RETRY_INTERVAL_MS
      if (now < nextAttemptTime) {
        return { shouldRun: false, attemptNumber: 0 }
      }
    }
  }

  return { shouldRun: true, attemptNumber: currentAttempts + 1 }
}

export const processSweepstakeSync = async (
  sweepstake: SweepstakeType,
  attemptNumber: number
): Promise<boolean> => {
  const now = new Date()
  const attemptTimestamp = now.toISOString()
  const currentAttempts = sweepstake.resultSyncLog?.attempts || []

  logger.info(
    `[autoResultSync] Iniciando tentativa ${attemptNumber}/${MAX_ATTEMPTS} para bolão "${sweepstake.title}" (ID: ${sweepstake.id}, Loteria: ${sweepstake.lotteryType}, Concurso: ${sweepstake.contestNumber || 'atual'})`
  )

  try {
    const lotteryData = await fetchLotteryFromCaixa(
      sweepstake.lotteryType!,
      sweepstake.contestNumber,
      { forceRefresh: true }
    )

    const hasNumbers = Boolean(lotteryData?.lastDrawnNumbers && lotteryData.lastDrawnNumbers.length > 0)
    
    const contestMatches = !sweepstake.contestNumber || !lotteryData?.contestNumber || lotteryData.contestNumber === sweepstake.contestNumber

    if (lotteryData && hasNumbers && contestMatches) {
      const drawnNumbers = lotteryData.lastDrawnNumbers!.map(Number).sort((a, b) => a - b)

      const successAttempt: ResultSyncAttempt = {
        attemptNumber,
        timestamp: attemptTimestamp,
        success: true,
        message: `Resultado do concurso #${lotteryData.contestNumber} obtido com sucesso da Caixa Econômica`,
        drawnNumbers
      }

      const updatedLog: ResultSyncLog = {
        status: 'success',
        attemptsCount: attemptNumber,
        maxAttempts: MAX_ATTEMPTS,
        lastAttemptAt: attemptTimestamp,
        successAt: attemptTimestamp,
        attempts: [...currentAttempts, successAttempt]
      }

      await sweepstakeRepository.update(sweepstake.id, {
        result: drawnNumbers,
        resultSyncLog: updatedLog
      })

      logger.info(
        `[autoResultSync] SUCESSO na tentativa ${attemptNumber} para bolão "${sweepstake.title}". Dezenas: ${drawnNumbers.join(', ')}`
      )

      sendSweepstakeResultEmailsRoutine(sweepstake.id, { triggeredBy: 'auto_sync' }).catch((emailError) => {
        logger.error(
          `[autoResultSync] Erro na rotina de envio de e-mails para o bolão "${sweepstake.title}" (ID: ${sweepstake.id})`,
          emailError
        )
      })

      return true
    }

    const isLastAttempt = attemptNumber >= MAX_ATTEMPTS
    const failMessage = !contestMatches
      ? `A Caixa retornou concurso #${lotteryData?.contestNumber}, aguardando apuração do concurso #${sweepstake.contestNumber}`
      : 'Resultado ainda não divulgado pela Caixa Econômica'

    const failedAttempt: ResultSyncAttempt = {
      attemptNumber,
      timestamp: attemptTimestamp,
      success: false,
      message: isLastAttempt
        ? `Falha final: limite de ${MAX_ATTEMPTS} tentativas atingido. ${failMessage}`
        : failMessage
    }

    const nextAttemptAt = !isLastAttempt
      ? new Date(now.getTime() + RETRY_INTERVAL_MS).toISOString()
      : undefined

    const updatedLog: ResultSyncLog = {
      status: isLastAttempt ? 'failed' : 'pending',
      attemptsCount: attemptNumber,
      maxAttempts: MAX_ATTEMPTS,
      lastAttemptAt: attemptTimestamp,
      nextAttemptAt,
      attempts: [...currentAttempts, failedAttempt]
    }

    await sweepstakeRepository.update(sweepstake.id, {
      resultSyncLog: updatedLog
    })

    logger.warn(
      `[autoResultSync] Falha na tentativa ${attemptNumber}/${MAX_ATTEMPTS} para bolão "${sweepstake.title}": ${failMessage}`
    )
    return false
  } catch (error) {
    const isLastAttempt = attemptNumber >= MAX_ATTEMPTS
    const errorMessage = (error as Error)?.message || 'Erro de conexão com o serviço da Caixa'

    const errorAttempt: ResultSyncAttempt = {
      attemptNumber,
      timestamp: attemptTimestamp,
      success: false,
      message: `Erro na consulta da Caixa: ${errorMessage}`
    }

    const nextAttemptAt = !isLastAttempt
      ? new Date(now.getTime() + RETRY_INTERVAL_MS).toISOString()
      : undefined

    const updatedLog: ResultSyncLog = {
      status: isLastAttempt ? 'failed' : 'pending',
      attemptsCount: attemptNumber,
      maxAttempts: MAX_ATTEMPTS,
      lastAttemptAt: attemptTimestamp,
      nextAttemptAt,
      attempts: [...currentAttempts, errorAttempt]
    }

    await sweepstakeRepository.update(sweepstake.id, {
      resultSyncLog: updatedLog
    })

    logger.error(
      `[autoResultSync] Exceção na tentativa ${attemptNumber}/${MAX_ATTEMPTS} para bolão "${sweepstake.title}": ${errorMessage}`
    )
    return false
  }
}

export const syncPendingSweepstakesResults = async (): Promise<void> => {
  if (isRunning) return
  isRunning = true

  try {
    const sweepstakes = await sweepstakeRepository.findAll()
    const now = Date.now()

    for (const sweepstake of sweepstakes) {
      const { shouldRun, attemptNumber } = shouldAttemptResultSync(sweepstake, now)

      if (shouldRun) {
        await processSweepstakeSync(sweepstake, attemptNumber)
      }
    }
  } catch (error) {
    logger.error('[autoResultSync] Erro no ciclo de sincronização automática de resultados', error)
  } finally {
    isRunning = false
  }
}

export const startAutoResultSyncRoutine = (): void => {
  if (syncIntervalTimer) {
    clearInterval(syncIntervalTimer)
  }

  logger.info('[autoResultSync] Rotina de busca automática de resultados de bolões inicializada.')

  syncPendingSweepstakesResults().catch((err) => {
    logger.error('[autoResultSync] Erro na verificação inicial', err)
  })

  syncIntervalTimer = setInterval(() => {
    syncPendingSweepstakesResults().catch((err) => {
      logger.error('[autoResultSync] Erro no intervalo de verificação', err)
    })
  }, CHECK_INTERVAL_MS)
}

export const stopAutoResultSyncRoutine = (): void => {
  if (syncIntervalTimer) {
    clearInterval(syncIntervalTimer)
    syncIntervalTimer = null
    logger.info('[autoResultSync] Rotina de busca automática de resultados parada.')
  }
}
