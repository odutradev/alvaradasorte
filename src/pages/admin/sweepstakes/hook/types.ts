import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseSweepstakesAdminReturn {
  setDetailsId: (id: string | null) => void
  setModalOpen: (open: boolean) => void
  loadSweepstakes: () => Promise<void>
  sweepstakes: SweepstakeResponse[]
  logout: () => Promise<void>
  user: AuthUser | null
  detailsId: string | null
  modalOpen: boolean
}