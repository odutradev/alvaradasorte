import axios from 'axios'

import type { CaixaLotteryRawResponse, LotteryModalityInfo } from './types'

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
  options?: { forceRefresh?: boolean }
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

  try {
    const url = contestNumber
      ? `${CAIXA_BASE_URL}/${normalizedType}/${contestNumber}`
      : `${CAIXA_BASE_URL}/${normalizedType}`

    const response = await axios.get<CaixaLotteryRawResponse>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json'
      },
      timeout: 10000
    })

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
    if (cached) {
      return cached.data
    }
    return null
  }
}

export const fetchAllLotteries = async (): Promise<LotteryModalityInfo[]> => {
  const promises = SUPPORTED_LOTTERIES.map(async (item) => {
    try {
      const data = await fetchLotteryFromCaixa(item.type)
      if (data) return data
    } catch {}

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

  return await Promise.all(promises)
}
