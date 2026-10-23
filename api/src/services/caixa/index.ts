import createLogger from '@/utils/logger'
import logRepository from '@/repositories/log'
import {
  fetchFromLoteriasCaixaApi,
  fetchFromCaixaOfficial,
  fetchFromGuidiApi,
  parseDateToIso
} from './providers'
import type {
  LotteryModalityInfo,
  FetchLotteryOptions,
  CaixaUserContext,
  LotteryProviderName,
  ParsedLotteryData
} from './types'

export { parseDateToIso }

const logger = createLogger('lottery-service')

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

const CACHE_TTL_MS = 5 * 60 * 1000

interface CacheEntry {
  timestamp: number
  data: LotteryModalityInfo
}

const memoryCache = new Map<string, CacheEntry>()

const getProviderOrder = (preferred?: LotteryProviderName): LotteryProviderName[] => {
  const envProvider = (process.env.LOTTERY_API_PROVIDER?.toLowerCase().trim() as LotteryProviderName) || undefined
  const primary = preferred || envProvider || 'loteriascaixa'
  const fallbackOrder: LotteryProviderName[] = ['loteriascaixa', 'caixa', 'guidi']
  return [primary, ...fallbackOrder.filter((p) => p !== primary)]
}

const fetchFromProvider = async (
  provider: LotteryProviderName,
  type: string,
  contestNumber?: number
): Promise<ParsedLotteryData> => {
  switch (provider) {
    case 'loteriascaixa':
      return await fetchFromLoteriasCaixaApi(type, contestNumber)
    case 'caixa':
      return await fetchFromCaixaOfficial(type, contestNumber)
    case 'guidi':
      return await fetchFromGuidiApi(type, contestNumber)
    default:
      return await fetchFromLoteriasCaixaApi(type, contestNumber)
  }
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

  const providers = getProviderOrder(options?.preferredProvider)
  let lastError: any = null
  const providerErrors: Record<string, string> = {}

  for (const provider of providers) {
    try {
      const data = await fetchFromProvider(provider, normalizedType, contestNumber)

      const result: LotteryModalityInfo = {
        type: normalizedType,
        name,
        color,
        contestNumber: data.contestNumber,
        nextContestNumber: data.nextContestNumber,
        drawDate: data.drawDate,
        estimatedPrize: data.estimatedPrize,
        accumulatedPrize: data.accumulatedPrize,
        isAccumulated: data.isAccumulated,
        lastDrawnNumbers: data.lastDrawnNumbers
      }

      memoryCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      })

      if (Object.keys(providerErrors).length > 0) {
        logger.info(
          `[lottery] Sucesso ao consultar loteria "${name}" via provedor fallback "${provider}" após falhas em: ${Object.keys(providerErrors).join(', ')}`
        )
      }

      return result
    } catch (err: any) {
      lastError = err
      const msg = err?.message || 'Falha na requisição'
      providerErrors[provider] = msg
      logger.warn(
        `[lottery] Provedor "${provider}" falhou para "${name}" (${normalizedType}${contestNumber ? ` #${contestNumber}` : ''}): ${msg}`
      )
    }
  }

  const errorCode = lastError?.code
  const httpStatus = lastError?.response?.status
  const isTimeout = errorCode === 'ETIMEDOUT' || errorCode === 'ECONNABORTED'
  const errorMessage = isTimeout
    ? 'Tempo limite de conexão esgotado ao contatar provedores de loterias'
    : lastError?.message || 'Erro de comunicação com todos os provedores de loterias'

  logger.error(
    `[lottery] Falha ao consultar loteria "${name}" (${normalizedType}${contestNumber ? ` #${contestNumber}` : ''}) em todos os provedores`,
    { providerErrors }
  )

  await logRepository.create({
    category: options?.userContext?.id ? 'user' : 'system',
    level: 'error',
    action: 'CAIXA_API_ERROR',
    title: `Erro na consulta da Loteria (${name})`,
    description: `Falha em todos os provedores para ${normalizedType}${contestNumber ? ` #${contestNumber}` : ''}: ${errorMessage}`,
    userId: options?.userContext?.id,
    userName: options?.userContext?.name,
    userEmail: options?.userContext?.email,
    targetId: normalizedType,
    targetName: name,
    errorMessage,
    errorStack: lastError?.stack,
    details: {
      lotteryType: normalizedType,
      contestNumber: contestNumber ?? null,
      httpStatus: httpStatus ?? null,
      errorCode: errorCode ?? null,
      isTimeout,
      providerErrors,
      cachedFallbackReturned: Boolean(cached)
    }
  })

  if (cached) {
    logger.warn(`[lottery] Retornando dados em cache expirados para "${normalizedType}" devido à falha geral.`)
    return cached.data
  }

  throw lastError
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
      `[lottery] ${failedCount}/${SUPPORTED_LOTTERIES.length} modalidades falharam na consulta em lote: ${failedLotteries.join(', ')}`
    )

    await logRepository.create({
      category: options?.userContext?.id ? 'user' : 'system',
      level: failedCount === SUPPORTED_LOTTERIES.length ? 'error' : 'warn',
      action: 'CAIXA_BATCH_FETCH_FAILED',
      title: 'Falha na consulta de loterias em lote',
      description: `${failedCount} de ${SUPPORTED_LOTTERIES.length} loterias não puderam ser carregadas: ${failedLotteries.join(', ')}`,
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

