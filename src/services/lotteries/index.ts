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
