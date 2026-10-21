import api from '@services/api'
import type { ListLotteriesResponse, LotteryItemResponse } from './types'

export const getLotteries = async (): Promise<ListLotteriesResponse> => {
  const response = await api.get<ListLotteriesResponse>('/iam/v1/lotteries')
  return response.data
}

export const getLotteryByType = async (type: string): Promise<LotteryItemResponse> => {
  const response = await api.get<LotteryItemResponse>(`/iam/v1/lotteries/${type}`)
  return response.data
}

export const LOTTERY_METADATA: Record<string, { name: string; color: string }> = {
  megasena: { name: 'Mega-Sena', color: '#209869' },
  lotofacil: { name: 'Lotofácil', color: '#930089' },
  quina: { name: 'Quina', color: '#260085' },
  lotomania: { name: 'Lotomania', color: '#F78100' },
  duplasena: { name: 'Dupla Sena', color: '#A61324' },
  timemania: { name: 'Timemania', color: '#049645' },
  diadesorte: { name: 'Dia de Sorte', color: '#CB852B' },
  maismilionaria: { name: '+Milionária', color: '#1B3573' },
  federal: { name: 'Federal', color: '#144673' }
}

export const getLotteryMeta = (type?: string) => {
  if (!type) return null
  const key = type.toLowerCase().replace(/[^a-z]/g, '')
  return LOTTERY_METADATA[key] || { name: type.toUpperCase(), color: '#1976d2' }
}
