export interface AuthUser {
  authProviderId: string
  photoUrl?: string
  email: string
  name: string
  id: string
}

export interface AuthStoreData {
  user: AuthUser | null
  loading: boolean
}

export interface AuthStore {
  updateUser: (partialUser: Partial<AuthUser>) => void
  setAuthUser: (user: AuthUser) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  auth: AuthStoreData
}