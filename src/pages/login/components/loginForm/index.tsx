import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'

import { FormContainer, SubmitButton } from './styles'

import type { AuthFormData } from '../../hook/types'
import type { LoginFormProps } from './types'

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { handleSubmit, register } = useForm<AuthFormData>()

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

export default LoginForm
