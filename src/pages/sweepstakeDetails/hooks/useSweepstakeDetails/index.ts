import { useState, useCallback, useEffect } from 'react'

import { getSweepstakeDetails } from '@services/sweepstakes'
import { getPresets } from '@services/presets'
import useAction from '@hooks/useAction'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { UseSweepstakeDetailsReturn } from './types'
import type { PresetResponse } from '@services/presets/types'

const useSweepstakeDetails = (id?: string): UseSweepstakeDetailsReturn => {
  const [details, setDetails] = useState<SweepstakeDetailsResponse | null>(null)
  const [preset, setPreset] = useState<PresetResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDetails = useCallback(async () => {
    if (!id) return

    setIsLoading(true)

    await useAction({
      action: async () => {
        const [detailsRes, presetsRes] = await Promise.all([
          getSweepstakeDetails(id),
          getPresets()
        ])
        return { detailsRes, presetsRes }
      },
      callback: ({ detailsRes, presetsRes }) => {
        setDetails(detailsRes)
        const found = presetsRes.find((p: PresetResponse) => p.id === detailsRes.presetId)
        if (found) setPreset(found)
      },
      silent: true
    })

    setIsLoading(false)
  }, [id])

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  return {
    details,
    preset,
    fetchDetails,
    isLoading
  }
}

export default useSweepstakeDetails