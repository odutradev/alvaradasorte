import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UserProfileProps {
  sweepstakes?: SweepstakeResponse[]
  isProfileIncomplete: boolean
  onEditProfile: () => void
  user: AuthUser
}