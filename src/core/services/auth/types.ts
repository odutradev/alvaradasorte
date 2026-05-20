import type { SyncPayload } from '@core/hooks/useAuth/types'
import type { AuthUser } from '@core/stores/auth/types'

export interface SyncServicePayload extends SyncPayload {
  firebaseToken: string
}

export interface SyncResponse {
  token: string
  user: AuthUser
}

export interface UpdateMePayload {
  department?: string
  fullName?: string
  photoUrl?: string
  phone?: string
  name?: string
}