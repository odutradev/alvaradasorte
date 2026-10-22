import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { deletePreset, getPresets, createPreset, updatePreset } from '@services/presets'
import useAction from '@hooks/useAction'
import useAuth from '@hooks/useAuth'

import type { UsePresetsReturn, PresetFormData } from './types'
import type { PresetResponse } from '@services/presets/types'

const EMPTY_FORM: PresetFormData = { receiverName: '', bank: '', pix: '' }

const usePresets = (): UsePresetsReturn => {
  const [presets, setPresets] = useState<PresetResponse[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<PresetResponse | null>(null)
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

  const handleCloseModal = () => {
    setEditingPreset(null)
    reset(EMPTY_FORM)
    setModalOpen(false)
  }

  const handleSetModalOpen = (open: boolean) => {
    if (!open) {
      handleCloseModal()
      return
    }
    setModalOpen(true)
  }

  const handleEdit = (preset: PresetResponse) => {
    reset({ receiverName: preset.receiverName, bank: preset.bank, pix: preset.pix })
    setEditingPreset(preset)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await useAction({
      action: async () => await deletePreset(id),
      callback: loadPresets,
      toastMessages: { success: 'Removido com sucesso!', pending: 'Removendo...', error: 'Erro ao remover' }
    })
  }

  const onSubmit = async (data: PresetFormData) => {
    await useAction({
      action: async () =>
        editingPreset ? await updatePreset(editingPreset.id, data) : await createPreset(data),
      callback: () => {
        loadPresets()
        handleCloseModal()
      },
      toastMessages: editingPreset
        ? { success: 'Predefinição atualizada!', pending: 'Atualizando...', error: 'Erro ao atualizar' }
        : { success: 'Predefinição criada!', pending: 'Salvando...', error: 'Erro ao criar' }
    })
  }

  return {
    setModalOpen: handleSetModalOpen,
    handleDelete,
    handleSubmit,
    editingPreset,
    handleEdit,
    modalOpen,
    onSubmit,
    register,
    presets,
    user
  }
}

export default usePresets
