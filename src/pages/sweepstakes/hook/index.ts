import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSweepstakes } from '@services/sweepstakes'
import useAction from '@hooks/useAction'
import useAuth from '@hooks/useAuth'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { UseSweepstakesAdminReturn } from './types'

const useSweepstakesAdmin = (): UseSweepstakesAdminReturn => {
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

  useEffect(() => {
    if (user) loadSweepstakes()
  }, [user, loadSweepstakes])

  return {
    loadSweepstakes,
    setModalOpen,
    viewDetails,
    sweepstakes,
    modalOpen,
    user
  }
}

export default useSweepstakesAdmin
