import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseSweepstakesAdminReturn {
  viewDetails: (id: string) => void
  setModalOpen: (open: boolean) => void
  loadSweepstakes: () => Promise<void>
  sweepstakes: SweepstakeResponse[]
  logout: () => Promise<void>
  user: AuthUser | null
  modalOpen: boolean
}