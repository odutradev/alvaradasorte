import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'

import useAction from '../../../../hooks/useAction'
import { useAuth } from '../../../../hooks/useAuth'

import * as S from './styles'

import type { LoginFormProps, AuthFormData } from './types'

export const LoginForm = ({ onToggleMode, isRegister }: LoginFormProps) => {
  const { registerWithEmail, loginWithEmail } = useAuth()
  const { handleSubmit, register } = useForm<AuthFormData>()
  const navigate = useNavigate()

  const onSubmit = async (data: AuthFormData) => {
    await useAction({
      action: async () => {
        if (isRegister) {
          await registerWithEmail({ ...data, name: data.name ?? '' })
          return
        }
        await loginWithEmail(data)
      },
      callback: () => navigate('/', { replace: true }),
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
          {isRegister
            ? 'Já tem uma conta? Entre aqui'
            : 'Não tem uma conta? Cadastre-se'}
        </Link>
      </S.ToggleContainer>
    </S.FormContainer>
  )
}