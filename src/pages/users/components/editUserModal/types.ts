import type { User, UpdateUserPayload } from '@services/users/types'

export type EditUserModalProps = {
  open: boolean
  user: User | null
  loading: boolean
  onClose: () => void
  onSubmit: (id: string, payload: UpdateUserPayload) => Promise<void>
}
