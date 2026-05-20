import { useCallback, useEffect, useState } from 'react'

import { getSweepstakes } from '@services/sweepstakes'
import useAction from '@hooks/useAction'
import { useAuth } from '@hooks/useAuth'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { UseHomeReturn } from './types'

export const useHome = (): UseHomeReturn => {
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { logout, user } = useAuth()

  const fetchSweepstakes = useCallback(async () => {
    await useAction({
      action: async () => await getSweepstakes(),
      callback: (data) => setSweepstakes(data),
      silent: true
    })
  }, [])

  useEffect(() => {
    if (user) fetchSweepstakes()
  }, [user, fetchSweepstakes])

  const isProfileIncomplete = Boolean(user && (!user.fullName || !user.department || !user.phone))

  return {
    isProfileIncomplete,
    fetchSweepstakes,
    setSelectedId,
    sweepstakes,
    selectedId,
    logout,
    user
  }
}