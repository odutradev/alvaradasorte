import type { User } from '@services/users/types'

export type UserTableProps = {
  users: User[]
  loading: boolean
  currentUserId?: string
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}
