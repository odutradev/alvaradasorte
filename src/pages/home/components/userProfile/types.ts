import type { AuthUser } from '@stores/auth/types'

export interface UserProfileProps {
  isProfileIncomplete: boolean
  user: AuthUser
}
