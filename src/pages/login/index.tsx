import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'

import { GridBackground } from '../../components/gridBackground'
import { ThemeToggle } from '../../components/themeToggle'
import { SocialLogin } from './components/socialLogin'
import { LoginForm } from './components/loginForm'
import { useAuth } from '../../hooks/useAuth'

import { ContentContainer, ThemeToggleWrapper, DividerWrapper, PageWrapper } from './styles'

export const LoginPage = () => {
  const { user } = useAuth()

  if (user) return <Navigate to="/" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
        <ContentContainer elevation={3}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              Alvaradasorte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Faça login para acessar o painel
            </Typography>
          </Box>
          <LoginForm />
          <DividerWrapper>
            <Typography variant="body2" color="text.secondary">
              ou continue com
            </Typography>
          </DividerWrapper>
          <SocialLogin />
        </ContentContainer>
      </PageWrapper>
    </GridBackground>
  )
}

export default LoginPage