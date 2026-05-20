import { useEffect, useState, useCallback } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { getPresets, deletePreset } from '@services/presets'
import { PresetFormModal } from './components/presetFormModal'
import { Header } from '@pages/home/components/header'
import useAction from '@hooks/useAction'
import { useAuth } from '@hooks/useAuth'
import * as S from './styles'

import type { PresetResponse } from '@services/presets/types'

export const PresetsAdminPage = () => {
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
    loadPresets()
  }, [loadPresets])

  const handleDelete = async (id: string) => {
    await useAction({
      action: async () => await deletePreset(id),
      callback: loadPresets,
      toastMessages: { success: 'Removido!', pending: 'Removendo...', error: 'Erro' }
    })
  }

  if (!user) return null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onLogout={logout} userRole={user.role} />
      <S.PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight={700}>Gerenciar Predefinições</Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>Nova Predefinição</Button>
        </Box>
        <S.ListContainer>
          {presets.map((preset) => (
            <Paper key={preset.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{preset.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  PIX: {preset.pix} | Banco: {preset.bank} | Nome: {preset.receiverName}
                </Typography>
              </Box>
              <IconButton color="error" onClick={() => handleDelete(preset.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </S.ListContainer>
      </S.PageContainer>
      <PresetFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadPresets} />
    </Box>
  )
}