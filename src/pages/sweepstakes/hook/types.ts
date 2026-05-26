import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseSweepstakesAdminReturn {
  setModalOpen: (open: boolean) => void
  loadSweepstakes: () => Promise<void>
  viewDetails: (id: string) => void
  sweepstakes: SweepstakeResponse[]
  user: AuthUser | null
  modalOpen: boolean
}
