import { DialogContent, DialogActions, DialogTitle, Typography, TextField, Button, Dialog, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import { useEffect } from 'react'

import { updateMeData } from '../../../../services/auth/me'
import useAction from '../../../../hooks/useAction'
import useAuthStore from '../../../../stores/auth'

interface ProfileFormData {
  department: string
  fullName: string
  phone: string
}

interface CompleteProfileModalProps {
  isProfileIncomplete: boolean
  onClose: () => void
  open: boolean
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  }
  return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

export const CompleteProfileModal = ({ isProfileIncomplete, onClose, open }: CompleteProfileModalProps) => {
  const { auth: { user }, updateUser } = useAuthStore()
  const { handleSubmit, register, reset, formState: { errors } } = useForm<ProfileFormData>()

  useEffect(() => {
    if (!open || !user) return
    reset({
      fullName: user.fullName ?? '',
      department: user.department ?? '',
      phone: user.phone ? formatPhone(user.phone) : ''
    })
  }, [open, user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    const cleanedData = {
      ...data,
      phone: data.phone.replace(/\D/g, '')
    }
    await useAction({
      action: async () => await updateMeData(cleanedData),
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
        <Box component="form" id="profile-form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Alert severity="warning" variant="outlined" sx={{ fontWeight: 600 }}>
            Atenção: O nome deve ser idêntico ao do extrato PIX, pois será usado para validar sua participação.
          </Alert>
          <TextField
            {...register('fullName', { required: 'Nome completo é obrigatório' })}
            label="Nome Completo"
            required
            fullWidth
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
          <TextField
            {...register('department', { required: 'Setor é obrigatório' })}
            label="Setor"
            required
            fullWidth
            error={!!errors.department}
            helperText={errors.department?.message}
          />
          <TextField
            {...register('phone', {
              required: 'Telefone é obrigatório',
              validate: (value) => {
                const digits = value.replace(/\D/g, '')
                return digits.length >= 10 || 'O telefone deve conter pelo menos 10 dígitos com o DDD'
              },
              onChange: (e) => {
                e.target.value = formatPhone(e.target.value)
              }
            })}
            label="Telefone"
            required
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Box>
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