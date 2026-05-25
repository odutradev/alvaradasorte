import { useCallback, useEffect, useState } from 'react'

import { getSweepstakes } from '@services/sweepstakes'
import { useAuth } from '@hooks/useAuth'
import useAction from '@hooks/useAction'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { UseHomeReturn } from './types'

const useHome = (): UseHomeReturn => {
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { logout, user } = useAuth()

  const fetchSweepstakes = useCallback(async () => {
    if (!user) return
    await useAction({
      action: async () => await getSweepstakes(user.id),
      callback: (data) => setSweepstakes(data),
      silent: true
    })
  }, [user])

  useEffect(() => {
    if (user) fetchSweepstakes()
  }, [user, fetchSweepstakes])

  const isProfileIncomplete = Boolean(user && (!user.fullName || !user.department || !user.phone))

  return {
    setIsProfileModalOpen,
    isProfileModalOpen,
    isProfileIncomplete,
    fetchSweepstakes,
    setSelectedId,
    sweepstakes,
    selectedId,
    logout,
    user
  }
}

export default useHome
