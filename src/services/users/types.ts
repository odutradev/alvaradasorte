export type User = {
  id: string
  role: 'admin' | 'user'
  name: string
  email: string
  fullName?: string
  department?: string
  phone?: string
  photoUrl?: string
  authProviderId?: string
  createdAt: string
  updatedAt: string
}

export type GetUsersParams = {
  page?: number
  limit?: number
  search?: string
  role?: string
}

export type GetUsersResponse = {
  rows: User[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  fullName?: string
  department?: string
  phone?: string
  role?: 'admin' | 'user'
}
