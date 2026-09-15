import type { User } from '@services/users/types'

export type UserTableProps = {
  users: User[]
  loading: boolean
  currentUserId?: string
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}
