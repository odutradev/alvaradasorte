import { TextField, Link } from '@mui/material'
import { useForm } from 'react-hook-form'

import { useAuth } from '@core/hooks/useAuth'
import useAction from '@core/hooks/useAction'
import * as S from './styles'

import type { LoginFormProps, AuthFormData } from './types'

export const LoginForm = ({ onToggleMode, isRegister }: LoginFormProps) => {
  const { registerWithEmail, loginWithEmail } = useAuth()
  const { handleSubmit, register } = useForm<AuthFormData>()

  const onSubmit = async (data: AuthFormData) => {
    await useAction({
      action: async () => isRegister ? registerWithEmail(data) : loginWithEmail(data),
      toastMessages: {
        success: isRegister ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!',
        pending: isRegister ? 'Criando conta...' : 'Autenticando...',
        error: 'Ocorreu um erro na autenticação.'
      }
    })
  }

  return (
    <S.FormContainer component="form" onSubmit={handleSubmit(onSubmit)}>
      {isRegister && (
        <TextField {...register('name')} label="Nome Completo" required fullWidth />
      )}
      <TextField {...register('email')} type="email" label="E-mail" required fullWidth />
      <TextField {...register('password')} type="password" label="Senha" required fullWidth />
      <S.SubmitButton type="submit" variant="contained" size="large" fullWidth>
        {isRegister ? 'Criar Conta' : 'Entrar'}
      </S.SubmitButton>
      <S.ToggleContainer>
        <Link component="button" variant="body2" onClick={onToggleMode} type="button">
          {isRegister ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
        </Link>
      </S.ToggleContainer>
    </S.FormContainer>
  )
}