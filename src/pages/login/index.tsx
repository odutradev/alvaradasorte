import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'

import { ContentContainer, ThemeToggleWrapper, DividerWrapper, PageWrapper } from './styles'
import GridBackground from '@components/gridBackground'
import SocialLogin from './components/socialLogin'
import ThemeToggle from '@components/themeToggle'
import LoginForm from './components/loginForm'
import { useLogin } from './hook'

const LoginPage = () => {
  const { isAuthenticated, handleAppleLogin, handleGoogleLogin, handleEmailLogin } = useLogin()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <ContentContainer elevation={3}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              AlvaraDaSorte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Faça login para acessar o painel
            </Typography>
          </Box>
          <LoginForm onSubmit={handleEmailLogin} />
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
