import { useCallback, useEffect, useState } from 'react'

import { getSweepstakes } from '@services/sweepstakes'
import { useAuth } from '@hooks/useAuth'
import useAction from '@hooks/useAction'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { UseSweepstakesAdminReturn } from './types'

export const useSweepstakesAdmin = (): UseSweepstakesAdminReturn => {
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { logout, user } = useAuth()

  const loadSweepstakes = useCallback(async () => {
    if (!user) return
    await useAction({
      action: async () => await getSweepstakes(user.id),
      callback: (data) => setSweepstakes(data),
      silent: true
    })
  }, [user])

  useEffect(() => {
    if (user) loadSweepstakes()
  }, [user, loadSweepstakes])

  return {
    loadSweepstakes,
    setDetailsId,
    setModalOpen,
    sweepstakes,
    detailsId,
    modalOpen,
    logout,
    user
  }
}