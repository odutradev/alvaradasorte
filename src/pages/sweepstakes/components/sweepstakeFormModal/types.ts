import type { CreateSweepstakeRequest, SweepstakeResponse } from '@services/sweepstakes/types'
import type { LotteryItemResponse } from '@services/lotteries/types'

export interface SweepstakeFormModalProps {
  initialData?: SweepstakeResponse | null
  initialLottery?: LotteryItemResponse | null
  onSuccess: () => void
  onClose: () => void
  open: boolean
}

export type SweepstakeFormData = Omit<CreateSweepstakeRequest, 'availableQuotas' | 'prizeValue' | 'quotaPrice' | 'contestNumber'> & {
  availableQuotas: number
  prizeValue: string
  quotaPrice: number
  contestNumber?: number | string
  lotteryType?: string
}