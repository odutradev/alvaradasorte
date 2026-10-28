import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { requestPasswordReset } from '@services/auth/passwordReset'
import useAction from '@hooks/useAction'
import Modal from '@components/modal'

import type { ForgotPasswordModalProps, ForgotPasswordFormData } from './types'

const ForgotPasswordModal = ({ open, onClose, initialEmail = '' }: ForgotPasswordModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: initialEmail }
  })

  useEffect(() => {
    if (open) {
      reset({ email: initialEmail })
    }
  }, [open, initialEmail, reset])

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await useAction({
      action: async () => await requestPasswordReset({ email: data.email }),
      callback: () => {
        onClose()
        reset()
      },
      toastMessages: {
        pending: 'Enviando link de redefinição...',
        success: 'Se o e-mail estiver cadastrado, você receberá o link de redefinição em instantes!',
        error: 'Erro ao solicitar redefinição de senha.'
      }
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title="Redefinir Senha"
      subtitle="Enviaremos um link para o seu e-mail para você criar uma nova senha."
      formProps={{
        id: 'forgot-password-form',
        onSubmit: handleSubmit(onSubmit)
      }}
      actions={
        <>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Link'}
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Digite o e-mail associado à sua conta abaixo:
        </Typography>
        <TextField
          {...register('email', {
            required: 'Informe o seu e-mail'
          })}
          type="email"
          label="E-mail"
          error={!!errors.email}
          helperText={errors.email?.message}
          required
          fullWidth
          autoFocus
        />
      </Stack>
    </Modal>
  )
}

export default ForgotPasswordModal
