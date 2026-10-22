import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { LotteryItemResponse } from '@services/lotteries/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseSweepstakesAdminReturn {
  setDeletingSweepstake: (sweepstake: SweepstakeResponse | null) => void
  deletingSweepstake: SweepstakeResponse | null
  editingSweepstake: SweepstakeResponse | null
  selectedLottery: LotteryItemResponse | null
  lotteryModalOpen: boolean
  modalOpen: boolean
  sweepstakes: SweepstakeResponse[]
  user: AuthUser | null
  handleDelete: (sweepstake: SweepstakeResponse) => void
  handleEdit: (sweepstake: SweepstakeResponse) => void
  handleCreateNew: () => void
  handleCloseModal: () => void
  handleCloseLotteryModal: () => void
  handleSelectLottery: (lottery: LotteryItemResponse) => void
  handleCreateManual: () => void
  confirmDelete: () => Promise<void>
  loadSweepstakes: () => Promise<void>
  viewDetails: (id: string) => void
}