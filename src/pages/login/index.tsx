import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useState } from 'react'

import { ContentContainer, ThemeToggleWrapper, DividerWrapper, PageWrapper, ModeToggleButton } from './styles'
import GridBackground from '@components/gridBackground'
import SocialLogin from './components/socialLogin'
import ThemeToggle from '@components/themeToggle'
import LoginForm from './components/loginForm'
import { useLogin } from './hook'

const LoginPage = () => {
  const { isAuthenticated, handleAppleLogin, handleGoogleLogin, handleEmailLogin, handleEmailRegister } = useLogin()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  if (isAuthenticated) return <Navigate to="/" replace />

  const toggleMode = () => setMode((prev) => (prev === 'login' ? 'register' : 'login'))

  return (
    <GridBackground>
      <PageWrapper>
        <ContentContainer elevation={3}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              AlvaraDaSorte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {mode === 'login' ? 'Faça login para acessar o painel' : 'Crie sua conta gratuitamente'}
            </Typography>
          </Box>
          <LoginForm onSubmit={mode === 'login' ? handleEmailLogin : handleEmailRegister} mode={mode} />
          <ModeToggleButton onClick={toggleMode}>
            {mode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça Login'}
          </ModeToggleButton>
          <DividerWrapper>
            <Typography variant="body2" color="text.secondary">
              ou continue com
            </Typography>
          </DividerWrapper>
          <SocialLogin onGoogleLogin={handleGoogleLogin} onAppleLogin={handleAppleLogin} />
        </ContentContainer>
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      </PageWrapper>
    </GridBackground>
  )
}

export default LoginPage