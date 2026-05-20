import { Navigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useState } from 'react'

import { SocialLogin } from './components/socialLogin'
import { LoginForm } from './components/loginForm'
import { useAuth } from '../../hooks/useAuth'

import * as S from './styles'

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false)
  const { user } = useAuth()

  if (user) return <Navigate to="/" replace />

  return (
    <S.PageWrapper>
      <S.ContentContainer elevation={3}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            Uailab
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isRegister
              ? 'Crie sua conta para continuar'
              : 'Faça login para acessar o painel'}
          </Typography>
        </Box>
        <LoginForm isRegister={isRegister} onToggleMode={() => setIsRegister(!isRegister)} />
        <S.DividerWrapper>
          <Typography variant="body2" color="text.secondary">
            ou continue com
          </Typography>
        </S.DividerWrapper>
        <SocialLogin />
      </S.ContentContainer>
    </S.PageWrapper>
  )
}

export default LoginPage