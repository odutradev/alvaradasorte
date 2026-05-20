import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'

import useAction from '../../../../hooks/useAction'
import { useAuth } from '../../../../hooks/useAuth'

import { FormContainer, SubmitButton } from './styles'

import type { AuthFormData } from './types'

export const LoginForm = () => {
  const { loginWithEmail } = useAuth()
  const { handleSubmit, register } = useForm<AuthFormData>()
  const navigate = useNavigate()

  const onSubmit = async (data: AuthFormData) => {
    await useAction({
      action: async () => await loginWithEmail(data),
      callback: () => navigate('/', { replace: true }),
      toastMessages: {
        success: 'Login realizado com sucesso!',
        pending: 'Autenticando...',
        error: 'Ocorreu um erro na autenticação.'
      }
    })
  }

  return (
    <FormContainer component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('email')} type="email" label="E-mail" required fullWidth />
      <TextField {...register('password')} type="password" label="Senha" required fullWidth />
      <SubmitButton type="submit" variant="contained" size="large" fullWidth>
        Entrar
      </SubmitButton>
    </FormContainer>
  )
}