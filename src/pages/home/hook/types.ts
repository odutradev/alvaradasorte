import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseHomeReturn {
  setSelectedId: (id: string | null) => void
  fetchSweepstakes: () => Promise<void>
  sweepstakes: SweepstakeResponse[]
  isProfileIncomplete: boolean
  selectedId: string | null
  logout: () => Promise<void>
  user: AuthUser | null
}