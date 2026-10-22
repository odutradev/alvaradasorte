import type { User } from '@services/users/types'

export type DeleteUserDialogProps = {
  open: boolean
  user: User | null
  loading: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}
