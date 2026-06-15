import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseSweepstakesAdminReturn {
  setDeletingSweepstake: (sweepstake: SweepstakeResponse | null) => void
  deletingSweepstake: SweepstakeResponse | null
  editingSweepstake: SweepstakeResponse | null
  handleDelete: (sweepstake: SweepstakeResponse) => void
  handleEdit: (sweepstake: SweepstakeResponse) => void
  handleCreateNew: () => void
  handleCloseModal: () => void
  confirmDelete: () => Promise<void>
  loadSweepstakes: () => Promise<void>
  viewDetails: (id: string) => void
  sweepstakes: SweepstakeResponse[]
  user: AuthUser | null
  modalOpen: boolean
}