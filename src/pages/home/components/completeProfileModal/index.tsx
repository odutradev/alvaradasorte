import { TextField, Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { ProfileForm, WarningAlert } from './styles'
import { updateMeData } from '@services/auth/me'
import useAuthStore from '@stores/auth'
import useAction from '@hooks/useAction'
import Modal from '@components/modal'

import type { CompleteProfileModalProps, ProfileFormData } from './types'

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

const CompleteProfileModal = ({ isProfileIncomplete, onClose, open }: CompleteProfileModalProps) => {
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
    const cleanedData = { ...data, phone: data.phone.replace(/\D/g, '') }
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
    <Modal
      open={open}
      onClose={isProfileIncomplete ? undefined : onClose}
      disableEscapeKeyDown={isProfileIncomplete}
      hideCloseButton={isProfileIncomplete}
      title="Complete seu Perfil"
      subtitle="Para participar de bolões, precisamos de mais algumas informações suas."
      formProps={{
        id: 'profile-form',
        onSubmit: handleSubmit(onSubmit)
      }}
      actions={
        <>
          {!isProfileIncomplete && (
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            Salvar Dados
          </Button>
        </>
      }
    >
      <ProfileForm>
        <WarningAlert severity="warning" variant="outlined">
          Atenção: O nome deve ser idêntico ao do extrato PIX, pois será usado para validar sua participação.
        </WarningAlert>
        <TextField
          {...register('fullName', { required: 'Nome completo é obrigatório' })}
          label="Nome Completo"
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          required
          fullWidth
        />
        <TextField
          {...register('department', { required: 'Setor é obrigatório' })}
          label="Setor"
          error={!!errors.department}
          helperText={errors.department?.message}
          required
          fullWidth
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
          error={!!errors.phone}
          helperText={errors.phone?.message}
          required
          fullWidth
        />
      </ProfileForm>
    </Modal>
  )
}

export default CompleteProfileModal
