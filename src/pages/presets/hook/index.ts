import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { deletePreset, getPresets, createPreset } from '@services/presets'
import useAction from '@hooks/useAction'
import useAuth from '@hooks/useAuth'

import type { UsePresetsReturn, PresetFormData } from './types'
import type { PresetResponse } from '@services/presets/types'

const usePresets = (): UsePresetsReturn => {
  const [presets, setPresets] = useState<PresetResponse[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()
  const { handleSubmit, register, reset } = useForm<PresetFormData>()

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

  const onSubmit = async (data: PresetFormData) => {
    await useAction({
      action: async () => await createPreset(data),
      callback: () => {
        loadPresets()
        setModalOpen(false)
        reset()
      },
      toastMessages: { success: 'Predefinição criada!', pending: 'Salvando...', error: 'Erro ao criar' }
    })
  }

  return {
    handleDelete,
    handleSubmit,
    setModalOpen,
    modalOpen,
    onSubmit,
    register,
    presets,
    user
  }
}

export default usePresets
