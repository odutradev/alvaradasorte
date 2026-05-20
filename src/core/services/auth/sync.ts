import api from '@core/services/api'

import type { SyncPayload } from '@core/hooks/useAuth/types'
import type { AuthUser } from '@core/stores/auth/types'

export const syncAuthUser = async (payload: SyncPayload): Promise<AuthUser> => {
  const response = await api.post<AuthUser>('/iam/v1/auth/sync', payload)
  return response.data
}