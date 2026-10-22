import type { LotteryItemResponse } from '@services/lotteries/types'

export interface LotterySelectModalProps {
  open: boolean
  onClose: () => void
  onSelect: (lottery: LotteryItemResponse) => void
  onManual?: () => void
}
