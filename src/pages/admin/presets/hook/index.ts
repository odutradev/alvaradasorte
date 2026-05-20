import { useCallback, useEffect, useState } from 'react'

import { deletePreset, getPresets } from '@services/presets'
import useAction from '@hooks/useAction'
import { useAuth } from '@hooks/useAuth'

import type { PresetResponse } from '@services/presets/types'
import type { UsePresetsReturn } from './types'

export const usePresets = (): UsePresetsReturn => {
  const [presets, setPresets] = useState<PresetResponse[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const { logout, user } = useAuth()

  const loadPresets = useCallback(async () => {
    await useAction({
      action: async () => await getPresets(),
      callback: (data) => setPresets(data),
      silent: true
    })
  }, [])

  useEffect(() => {
    if (user) loadPresets()
  }, [user, loadPresets])

  const handleDelete = async (id: string) => {
    await useAction({
      action: async () => await deletePreset(id),
      callback: loadPresets,
      toastMessages: { success: 'Removido com sucesso!', pending: 'Removendo...', error: 'Erro ao remover' }
    })
  }

  return {
    handleDelete,
    setModalOpen,
    loadPresets,
    modalOpen,
    presets,
    logout,
    user
  }
}