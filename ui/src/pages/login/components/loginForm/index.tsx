import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'

import { FormContainer, SubmitButton } from './styles'

import type { AuthFormData } from '../../hook/types'
import type { LoginFormProps } from './types'

const LoginForm = ({ onSubmit, mode }: LoginFormProps) => {
  const { handleSubmit, register, watch } = useForm<AuthFormData>()
  const password = watch('password')

  return (
    <FormContainer component="form" onSubmit={handleSubmit(onSubmit)}>
      {mode === 'register' && (
        <TextField {...register('name')} type="text" label="Nome Completo" required fullWidth />
      )}
      <TextField {...register('email')} type="email" label="E-mail" required fullWidth />
      <TextField {...register('password')} type="password" label="Senha" required fullWidth />
      {mode === 'register' && (
        <TextField
          {...register('confirmPassword', {
            validate: (value) => value === password || 'As senhas não coincidem'
          })}
          type="password"
          label="Confirmar Senha"
          required
          fullWidth
        />
      )}
      <SubmitButton type="submit" variant="contained" size="large" fullWidth>
        {mode === 'login' ? 'Entrar' : 'Criar Conta'}
      </SubmitButton>
    </FormContainer>
  )
}

export default LoginForm