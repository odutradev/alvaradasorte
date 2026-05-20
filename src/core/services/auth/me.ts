import api from '@core/services/api'

import type { AuthUser } from '@core/stores/auth/types'
import type { UpdateMePayload } from './types'

export const getMeData = async (): Promise<AuthUser> => {
  const response = await api.get<AuthUser>('/iam/v1/auth/me')
  return response.data
}

export const updateMeData = async (payload: UpdateMePayload): Promise<AuthUser> => {
  const response = await api.patch<AuthUser>('/iam/v1/auth/me', payload)
  return response.data
}