import { DialogContent, DialogActions, DialogTitle, Typography, TextField, Button, Dialog } from '@mui/material'
import { useForm } from 'react-hook-form'

import { updateMeData } from '@core/services/auth/me'
import useAuthStore from '@core/stores/auth'
import useAction from '@core/hooks/useAction'
import * as S from './styles'

import type { CompleteProfileModalProps, ProfileFormData } from './types'

export const CompleteProfileModal = ({ open }: CompleteProfileModalProps) => {
  const { handleSubmit, register } = useForm<ProfileFormData>()
  const { updateUser } = useAuthStore()

  const onSubmit = async (data: ProfileFormData) => {
    await useAction({
      action: async () => await updateMeData(data),
      callback: (res) => updateUser(res),
      toastMessages: {
        pending: 'Atualizando perfil...',
        success: 'Perfil completo!',
        error: 'Erro ao atualizar'
      }
    })
  }

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>Complete seu Perfil</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Para participar de bolões, precisamos de mais algumas informações suas.
        </Typography>
        <S.FormContainer component="form" id="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register('fullName')} label="Nome Completo" required fullWidth />
          <TextField {...register('department')} label="Setor" required fullWidth />
          <TextField {...register('phone')} label="Telefone" required fullWidth />
        </S.FormContainer>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="profile-form" variant="contained" color="primary">
          Salvar Dados
        </Button>
      </DialogActions>
    </Dialog>
  )
}