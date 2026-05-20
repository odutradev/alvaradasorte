import api from '@core/services/api'

import type { ListSweepstakesResponse, SweepstakeDetailsResponse, CreateSweepstakeRequest, JoinSweepstakeRequest, SweepstakeResponse } from './types'

export const getSweepstakes = async (): Promise<ListSweepstakesResponse> => {
  const response = await api.get<ListSweepstakesResponse>('/iam/v1/sweepstakes')
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
  await api.post(`/iam/v1/sweepstakes/${id}/join`, payload)
}