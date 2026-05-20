import type { SyncPayload } from '@core/hooks/useAuth/types'
import type { AuthUser } from '@core/stores/auth/types'

export interface SyncServicePayload extends SyncPayload {
  firebaseToken: string
}

export interface SyncResponse {
  user: AuthUser
  token: string
}

export interface UpdateMePayload {
  photoUrl?: string
  name?: string
}