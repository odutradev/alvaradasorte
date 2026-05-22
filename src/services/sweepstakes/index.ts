import api from '@services/api'

import type { ListSweepstakesResponse, SweepstakeDetailsResponse, CreateSweepstakeRequest, JoinSweepstakeRequest, SweepstakeResponse, SetGamesRequest, SetResultRequest } from './types'

export const getSweepstakes = async (userId?: string): Promise<ListSweepstakesResponse> => {
  const response = await api.get<ListSweepstakesResponse>('/iam/v1/sweepstakes', {
    params: userId ? { userId } : undefined
  })
  return response.data
}

export const createSweepstake = async (payload: CreateSweepstakeRequest): Promise<SweepstakeResponse> => {
  const response = await api.post<SweepstakeResponse>('/iam/v1/sweepstakes', payload)
  return response.data
}

export const getSweepstakeDetails = async (id: string): Promise<SweepstakeDetailsResponse> => {
  const response = await api.get<SweepstakeDetailsResponse>(`/iam/v1/sweepstakes/${id}/details`)
  return response.data
}

export const joinSweepstake = async (id: string, payload: JoinSweepstakeRequest): Promise<void> => {
  const formData = new FormData()
  formData.append('receipt', payload.receipt)
  await api.post(`/iam/v1/sweepstakes/${id}/join`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const setSweepstakeGames = async (id: string, payload: SetGamesRequest): Promise<SweepstakeResponse> => {
  const response = await api.patch<SweepstakeResponse>(`/iam/v1/sweepstakes/${id}/games`, payload)
  return response.data
}

export const setSweepstakeResult = async (id: string, payload: SetResultRequest): Promise<SweepstakeResponse> => {
  const response = await api.patch<SweepstakeResponse>(`/iam/v1/sweepstakes/${id}/result`, payload)
  return response.data
}
