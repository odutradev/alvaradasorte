import { DialogContent, DialogActions, DialogTitle, Typography, TextField, Button, Dialog, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { updateMeData } from '@services/auth/me'
import { FormContainer } from './styles'
import useAction from '@hooks/useAction'
import useAuthStore from '@stores/auth'

import type { CompleteProfileModalProps, ProfileFormData } from './types'

export const CompleteProfileModal = ({ isProfileIncomplete, onClose, open }: CompleteProfileModalProps) => {
  const { user, updateUser } = useAuthStore()
  const { handleSubmit, register, reset } = useForm<ProfileFormData>()

  useEffect(() => {
    if (open && user) {
      reset({
        fullName: user.fullName ?? '',
        department: user.department ?? '',
        phone: user.phone ?? ''
      })
    }
  }, [open, user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    await useAction({
      action: async () => await updateMeData(data),
      callback: (res) => {
        updateUser(res)
        onClose()
      },
      toastMessages: {
        pending: 'Atualizando perfil...',
        success: 'Perfil completo!',
        error: 'Erro ao atualizar'
      }
    })
  }

  return (
    <Dialog open={open} onClose={isProfileIncomplete ? undefined : onClose} disableEscapeKeyDown={isProfileIncomplete}>
      <DialogTitle>Complete seu Perfil</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Para participar de bolões, precisamos de mais algumas informações suas.
        </Typography>
        <FormContainer component="form" id="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <Alert severity="warning" variant="outlined" sx={{ fontWeight: 600 }}>
            Atenção: O nome deve ser idêntico ao do extrato PIX, pois será usado para validar sua participação.
          </Alert>
          <TextField {...register('fullName')} label="Nome Completo" required fullWidth />
          <TextField {...register('department')} label="Setor" required fullWidth />
          <TextField {...register('phone')} label="Telefone" required fullWidth />
        </FormContainer>
      </DialogContent>
      <DialogActions>
        {!isProfileIncomplete && (
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
        )}
        <Button type="submit" form="profile-form" variant="contained" color="primary">
          Salvar Dados
        </Button>
      </DialogActions>
    </Dialog>
  )
}