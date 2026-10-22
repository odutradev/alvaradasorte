import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseHomeReturn {
  setIsProfileModalOpen: (open: boolean) => void
  setSelectedId: (id: string | null) => void
  fetchSweepstakes: () => Promise<void>
  sweepstakes: SweepstakeResponse[]
  isProfileModalOpen: boolean
  isProfileIncomplete: boolean
  selectedId: string | null
  logout: () => Promise<void>
  user: AuthUser | null
}