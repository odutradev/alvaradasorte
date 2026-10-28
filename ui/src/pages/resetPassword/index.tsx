import { useSearchParams, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import { PageWrapper, CardContainer, HeaderContainer, FormContainer, SubmitButton, ThemeToggleWrapper } from './styles'
import { confirmPasswordReset } from '@services/auth/passwordReset'
import GridBackground from '@components/gridBackground'
import ThemeToggle from '@components/themeToggle'
import useAction from '@hooks/useAction'

import type { ResetPasswordFormData } from './types'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''
  const [isCompleted, setIsCompleted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>()

  const password = watch('password')

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return

    await useAction({
      action: async () => await confirmPasswordReset({ token, password: data.password }),
      callback: () => {
        setIsCompleted(true)
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      },
      toastMessages: {
        pending: 'Redefinindo sua senha...',
        success: 'Senha redefinida com sucesso!',
        error: 'Não foi possível redefinir a senha. Verifique se o link ainda é válido.'
      }
    })
  }

  return (
    <GridBackground>
      <PageWrapper>
        <CardContainer elevation={3}>
          <HeaderContainer>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              AlvaraDaSorte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Redefinição de Senha
            </Typography>
          </HeaderContainer>

          {!token ? (
            <>
              <Alert severity="error" variant="outlined">
                Link de redefinição inválido ou ausente. Solicite um novo link na tela de login ou no seu perfil.
              </Alert>
              <Button variant="contained" fullWidth onClick={() => navigate('/login', { replace: true })}>
                Ir para o Login
              </Button>
            </>
          ) : isCompleted ? (
            <>
              <Alert severity="success" variant="outlined">
                Sua senha foi atualizada com sucesso! Redirecionando para o login...
              </Alert>
              <Button variant="contained" fullWidth onClick={() => navigate('/login', { replace: true })}>
                Ir para o Login agora
              </Button>
            </>
          ) : (
            <FormContainer component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('password', {
                  required: 'Informe a nova senha',
                  minLength: {
                    value: 6,
                    message: 'A senha deve ter no mínimo 6 caracteres'
                  }
                })}
                type="password"
                label="Nova Senha"
                error={!!errors.password}
                helperText={errors.password?.message}
                required
                fullWidth
              />
              <TextField
                {...register('confirmPassword', {
                  required: 'Confirme a nova senha',
                  validate: (value) => value === password || 'As senhas não coincidem'
                })}
                type="password"
                label="Confirmar Nova Senha"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
                fullWidth
              />
              <SubmitButton type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
              </SubmitButton>
              <Button
                variant="text"
                color="inherit"
                size="small"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Voltar para o login
              </Button>
            </FormContainer>
          )}
        </CardContainer>
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      </PageWrapper>
    </GridBackground>
  )
}

export default ResetPassword

