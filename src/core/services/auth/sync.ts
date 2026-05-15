import api from '@core/services/api'

import type { SyncPayload } from '@core/hooks/useAuth/types'
import type { AuthUser } from '@core/stores/auth/types'

export const syncAuthUser = async (payload: SyncPayload, token: string): Promise<AuthUser> => {
  const response = await api.post<AuthUser>('/iam/v1/auth/sync', payload, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}