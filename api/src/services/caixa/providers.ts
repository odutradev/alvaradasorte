import { createLotteryClient } from './client'
import type { ParsedLotteryData } from './types'

export const parseDateToIso = (dateStr?: string): string | null => {
  if (!dateStr) return null
  const trimmed = dateStr.trim()
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T20:00:00.000Z`
    }
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.includes('T') ? trimmed : `${trimmed.slice(0, 10)}T20:00:00.000Z`
  }
  return null
}

const sanitizeDrawnNumbers = (type: string, numbers?: (string | number)[]): string[] => {
  if (!Array.isArray(numbers) || numbers.length === 0) return []
  const stringified = numbers.map((n) => String(n).padStart(2, '0'))
  if (type === 'duplasena' && stringified.length > 6) {
    return stringified.slice(0, 6)
  }
  return stringified
}

export const fetchFromLoteriasCaixaApi = async (
  type: string,
  contestNumber?: number
): Promise<ParsedLotteryData> => {
  const client = createLotteryClient(5000)
  const url = contestNumber
    ? `https://loteriascaixa-api.herokuapp.com/api/${type}/${contestNumber}`
    : `https://loteriascaixa-api.herokuapp.com/api/${type}/latest`

  const response = await client.get<any>(url)
  const raw = response.data

  const contest = Number(raw.concurso || raw.numero)
  const nextContest = Number(raw.proximoConcurso || raw.numeroConcursoProximo) || contest + 1
  const drawDate = parseDateToIso(raw.dataProximoConcurso || raw.data || raw.dataApuracao)

  return {
    contestNumber: contest,
    nextContestNumber: nextContest,
    drawDate,
    estimatedPrize: Number(raw.valorEstimadoProximoConcurso) || 0,
    accumulatedPrize: Number(raw.valorAcumuladoProximoConcurso) || 0,
    isAccumulated: Boolean(raw.acumulou ?? raw.acumulado),
    lastDrawnNumbers: sanitizeDrawnNumbers(type, raw.dezenas || raw.listaDezenas || raw.dezenasSorteadasOrdemSorteio)
  }
}

export const fetchFromCaixaOfficial = async (
  type: string,
  contestNumber?: number
): Promise<ParsedLotteryData> => {
  const client = createLotteryClient(5000)
  const url = contestNumber
    ? `https://servicebus2.caixa.gov.br/portaldeloterias/api/${type}/${contestNumber}`
    : `https://servicebus2.caixa.gov.br/portaldeloterias/api/${type}`

  const response = await client.get<any>(url)
  const raw = response.data

  const contest = Number(raw.numero || raw.concurso)
  const nextContest = Number(raw.numeroConcursoProximo || raw.proximoConcurso) || contest + 1
  const drawDate = parseDateToIso(raw.dataProximoConcurso || raw.dataApuracao || raw.data)

  return {
    contestNumber: contest,
    nextContestNumber: nextContest,
    drawDate,
    estimatedPrize: Number(raw.valorEstimadoProximoConcurso) || 0,
    accumulatedPrize: Number(raw.valorAcumuladoProximoConcurso) || 0,
    isAccumulated: Boolean(raw.acumulado ?? raw.acumulou),
    lastDrawnNumbers: sanitizeDrawnNumbers(type, raw.listaDezenas || raw.dezenasSorteadasOrdemSorteio || raw.dezenas)
  }
}

export const fetchFromGuidiApi = async (
  type: string,
  contestNumber?: number
): Promise<ParsedLotteryData> => {
  const client = createLotteryClient(5000)
  const url = contestNumber
    ? `https://api.guidi.dev.br/loteria/${type}/${contestNumber}`
    : `https://api.guidi.dev.br/loteria/${type}/ultimo`

  const response = await client.get<any>(url)
  const raw = response.data

  const contest = Number(raw.numero || raw.concurso)
  const nextContest = Number(raw.numeroConcursoProximo || raw.proximoConcurso) || contest + 1
  const drawDate = parseDateToIso(raw.dataProximoConcurso || raw.dataApuracao || raw.data)

  return {
    contestNumber: contest,
    nextContestNumber: nextContest,
    drawDate,
    estimatedPrize: Number(raw.valorEstimadoProximoConcurso) || 0,
    accumulatedPrize: Number(raw.valorAcumuladoProximoConcurso) || 0,
    isAccumulated: Boolean(raw.acumulado ?? raw.acumulou),
    lastDrawnNumbers: sanitizeDrawnNumbers(type, raw.listaDezenas || raw.dezenasSorteadasOrdemSorteio || raw.dezenas)
  }
}
