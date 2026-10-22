import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSweepstakes, deleteSweepstake } from '@services/sweepstakes'
import useAction from '@hooks/useAction'
import useAuth from '@hooks/useAuth'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { LotteryItemResponse } from '@services/lotteries/types'
import type { UseSweepstakesAdminReturn } from './types'

const useSweepstakesAdmin = (): UseSweepstakesAdminReturn => {
  const [deletingSweepstake, setDeletingSweepstake] = useState<SweepstakeResponse | null>(null)
  const [editingSweepstake, setEditingSweepstake] = useState<SweepstakeResponse | null>(null)
  const [selectedLottery, setSelectedLottery] = useState<LotteryItemResponse | null>(null)
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [lotteryModalOpen, setLotteryModalOpen] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  const loadSweepstakes = useCallback(async () => {
    if (!user) return
    await useAction({
      action: async () => await getSweepstakes(user.id),
      callback: (data) => setSweepstakes(Array.isArray(data) ? data : []),
      silent: true
    })
  }, [user])

  const viewDetails = useCallback((id: string) => {
    navigate(`/sweepstakes/${id}`)
  }, [navigate])

  const handleCreateNew = useCallback(() => {
    setEditingSweepstake(null)
    setSelectedLottery(null)
    setLotteryModalOpen(true)
  }, [])

  const handleSelectLottery = useCallback((lottery: LotteryItemResponse) => {
    setSelectedLottery(lottery)
    setLotteryModalOpen(false)
    setModalOpen(true)
  }, [])

  const handleCreateManual = useCallback(() => {
    setSelectedLottery(null)
    setLotteryModalOpen(false)
    setModalOpen(true)
  }, [])

  const handleCloseLotteryModal = useCallback(() => {
    setLotteryModalOpen(false)
  }, [])

  const handleEdit = useCallback((sweepstake: SweepstakeResponse) => {
    setEditingSweepstake(sweepstake)
    setSelectedLottery(null)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((sweepstake: SweepstakeResponse) => {
    setDeletingSweepstake(sweepstake)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingSweepstake(null)
    setSelectedLottery(null)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deletingSweepstake) return
    await useAction({
      action: async () => await deleteSweepstake(deletingSweepstake.id),
      callback: () => {
        setDeletingSweepstake(null)
        loadSweepstakes()
      },
      toastMessages: { success: 'Bolão excluído!', pending: 'Excluindo...', error: 'Erro ao excluir' }
    })
  }, [deletingSweepstake, loadSweepstakes])

  useEffect(() => {
    if (user) loadSweepstakes()
  }, [user, loadSweepstakes])

  return {
    setDeletingSweepstake,
    deletingSweepstake,
    editingSweepstake,
    selectedLottery,
    lotteryModalOpen,
    modalOpen,
    sweepstakes,
    user,
    handleDelete,
    handleEdit,
    handleCreateNew,
    handleCloseModal,
    handleCloseLotteryModal,
    handleSelectLottery,
    handleCreateManual,
    confirmDelete,
    loadSweepstakes,
    viewDetails
  }
}

export default useSweepstakesAdmin