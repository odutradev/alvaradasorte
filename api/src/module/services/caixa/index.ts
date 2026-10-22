import createLogger from '@core/utils/logger'
import logRepository from '@module/repositories/log'
import { createCaixaClient } from './client'
import type { CaixaLotteryRawResponse, LotteryModalityInfo, FetchLotteryOptions, CaixaUserContext } from './types'

const logger = createLogger('caixa')

export const SUPPORTED_LOTTERIES = [
  { type: 'megasena', name: 'Mega-Sena', color: '#209869' },
  { type: 'lotofacil', name: 'Lotofácil', color: '#930089' },
  { type: 'quina', name: 'Quina', color: '#260085' },
  { type: 'lotomania', name: 'Lotomania', color: '#F78100' },
  { type: 'duplasena', name: 'Dupla Sena', color: '#A61324' },
  { type: 'timemania', name: 'Timemania', color: '#049645' },
  { type: 'diadesorte', name: 'Dia de Sorte', color: '#CB852B' },
  { type: 'maismilionaria', name: '+Milionária', color: '#1B3573' },
  { type: 'federal', name: 'Federal', color: '#144673' }
] as const

const CAIXA_BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api'
const CACHE_TTL_MS = 5 * 60 * 1000

interface CacheEntry {
  timestamp: number
  data: LotteryModalityInfo
}

const memoryCache = new Map<string, CacheEntry>()

const parseCaixaDateToIso = (dateStr?: string): string | null => {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const [day, month, year] = parts
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T20:00:00.000Z`
}

export const fetchLotteryFromCaixa = async (
  type: string,
  contestNumber?: number,
  options?: FetchLotteryOptions
): Promise<LotteryModalityInfo | null> => {
  const normalizedType = type.toLowerCase().trim()
  const meta = SUPPORTED_LOTTERIES.find((l) => l.type === normalizedType)
  const name = meta?.name ?? normalizedType.toUpperCase()
  const color = meta?.color ?? '#209869'

  const cacheKey = contestNumber ? `${normalizedType}-${contestNumber}` : normalizedType
  const cached = memoryCache.get(cacheKey)
  if (!options?.forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const url = contestNumber
    ? `${CAIXA_BASE_URL}/${normalizedType}/${contestNumber}`
    : `${CAIXA_BASE_URL}/${normalizedType}`

  try {
    const client = createCaixaClient()
    const response = await client.get<CaixaLotteryRawResponse>(url)

    const raw = response.data
    const drawDateIso = parseCaixaDateToIso(raw.dataProximoConcurso || raw.dataApuracao)

    const result: LotteryModalityInfo = {
      type: normalizedType,
      name,
      color,
      contestNumber: raw.numero,
      nextContestNumber: raw.numeroConcursoProximo || raw.numero + 1,
      drawDate: drawDateIso,
      estimatedPrize: raw.valorEstimadoProximoConcurso ?? 0,
      accumulatedPrize: raw.valorAcumuladoProximoConcurso ?? 0,
      isAccumulated: Boolean(raw.acumulado),
      lastDrawnNumbers: raw.listaDezenas || raw.dezenasSorteadasOrdemSorteio || []
    }

    memoryCache.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    })

    return result
  } catch (error) {
    const err = error as any
    const errorCode = err?.code
    const httpStatus = err?.response?.status
    const httpStatusText = err?.response?.statusText
    const isTimeout = errorCode === 'ETIMEDOUT' || errorCode === 'ECONNABORTED'
    const errorMessage = isTimeout
      ? 'Tempo limite de conexão esgotado ao contatar o portal da Caixa Econômica Federal'
      : err?.message || 'Erro de comunicação com a API da Caixa'

    logger.error(
      `[caixa] Falha ao consultar loteria "${name}" (${normalizedType}${contestNumber ? ` #${contestNumber}` : ''}): ${errorMessage}`,
      { url, errorCode, httpStatus }
    )

    await logRepository.create({
      category: options?.userContext?.id ? 'user' : 'system',
      level: 'error',
      action: 'CAIXA_API_ERROR',
      title: `Erro na consulta da Caixa (${name})`,
      description: `Falha na requisição para ${normalizedType}${contestNumber ? ` #${contestNumber}` : ''}: ${errorMessage}`,
      userId: options?.userContext?.id,
      userName: options?.userContext?.name,
      userEmail: options?.userContext?.email,
      targetId: normalizedType,
      targetName: name,
      errorMessage,
      errorStack: err?.stack,
      details: {
        url,
        lotteryType: normalizedType,
        contestNumber: contestNumber ?? null,
        httpStatus: httpStatus ?? null,
        httpStatusText: httpStatusText ?? null,
        errorCode: errorCode ?? null,
        isTimeout,
        cachedFallbackReturned: Boolean(cached)
      }
    })

    if (cached) {
      logger.warn(`[caixa] Retornando dados em cache expirados para "${normalizedType}" devido à falha na Caixa.`)
      return cached.data
    }

    throw error
  }
}

export const fetchAllLotteries = async (options?: { userContext?: CaixaUserContext }): Promise<LotteryModalityInfo[]> => {
  let failedCount = 0
  const failedLotteries: string[] = []

  const promises = SUPPORTED_LOTTERIES.map(async (item) => {
    try {
      const data = await fetchLotteryFromCaixa(item.type, undefined, options)
      if (data) return data
    } catch {
      failedCount++
      failedLotteries.push(item.name)
    }

    return {
      type: item.type,
      name: item.name,
      color: item.color,
      contestNumber: 0,
      nextContestNumber: 0,
      drawDate: null,
      estimatedPrize: 0,
      accumulatedPrize: 0,
      isAccumulated: false
    } satisfies LotteryModalityInfo
  })

  const results = await Promise.all(promises)

  if (failedCount > 0) {
    logger.warn(
      `[caixa] ${failedCount}/${SUPPORTED_LOTTERIES.length} modalidades falharam na consulta em lote da Caixa: ${failedLotteries.join(', ')}`
    )

    await logRepository.create({
      category: options?.userContext?.id ? 'user' : 'system',
      level: failedCount === SUPPORTED_LOTTERIES.length ? 'error' : 'warn',
      action: 'CAIXA_BATCH_FETCH_FAILED',
      title: 'Falha na consulta de loterias da Caixa em lote',
      description: `${failedCount} de ${SUPPORTED_LOTTERIES.length} loterias não puderam ser carregadas da Caixa: ${failedLotteries.join(', ')}`,
      userId: options?.userContext?.id,
      userName: options?.userContext?.name,
      userEmail: options?.userContext?.email,
      details: {
        failedCount,
        total: SUPPORTED_LOTTERIES.length,
        failedLotteries
      }
    })
  }

  return results
}

