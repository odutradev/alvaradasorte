import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSweepstakes } from '@services/sweepstakes'
import { useAuth } from '@hooks/useAuth'
import useAction from '@hooks/useAction'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { UseSweepstakesAdminReturn } from './types'

export const useSweepstakesAdmin = (): UseSweepstakesAdminReturn => {
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const { logout, user } = useAuth()
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

  useEffect(() => {
    if (user) loadSweepstakes()
  }, [user, loadSweepstakes])

  return {
    loadSweepstakes,
    setModalOpen,
    viewDetails,
    sweepstakes,
    modalOpen,
    logout,
    user
  }
}