import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSweepstakes, deleteSweepstake } from '@services/sweepstakes'
import useAction from '@hooks/useAction'
import useAuth from '@hooks/useAuth'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { UseSweepstakesAdminReturn } from './types'

const useSweepstakesAdmin = (): UseSweepstakesAdminReturn => {
  const [deletingSweepstake, setDeletingSweepstake] = useState<SweepstakeResponse | null>(null)
  const [editingSweepstake, setEditingSweepstake] = useState<SweepstakeResponse | null>(null)
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  const loadSweepstakes = useCallback(async () => {
    if (!user) return
    await useAction({
      action: async () => await getSweepstakes(user.id),
      callback: (data) => setSweepstakes(data),
      silent: true
    })
  }, [user])

  const viewDetails = useCallback((id: string) => {
    navigate(`/sweepstakes/${id}`)
  }, [navigate])

  const handleCreateNew = useCallback(() => {
    setEditingSweepstake(null)
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback((sweepstake: SweepstakeResponse) => {
    setEditingSweepstake(sweepstake)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((sweepstake: SweepstakeResponse) => {
    setDeletingSweepstake(sweepstake)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingSweepstake(null)
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
    handleCloseModal,
    handleCreateNew,
    loadSweepstakes,
    confirmDelete,
    handleDelete,
    viewDetails,
    sweepstakes,
    handleEdit,
    modalOpen,
    user
  }
}

export default useSweepstakesAdmin