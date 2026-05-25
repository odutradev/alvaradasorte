import { Navigate } from 'react-router-dom'

import { ContentContainer, ThemeToggleWrapper, PageWrapper } from './styles'
import GridBackground from '@components/gridBackground'
import SocialLogin from './components/socialLogin'
import LoginDivider from './components/loginDivider'
import LoginHeader from './components/loginHeader'
import ModeToggle from './components/modeToggle'
import ThemeToggle from '@components/themeToggle'
import LoginForm from './components/loginForm'
import useLogin from './hook'

const LoginPage = () => {
  const { isAuthenticated, mode, toggleMode, handleAppleLogin, handleGoogleLogin, handleEmailLogin, handleEmailRegister } = useLogin()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <ContentContainer elevation={3}>
          <LoginHeader mode={mode} />
          <LoginForm onSubmit={mode === 'login' ? handleEmailLogin : handleEmailRegister} mode={mode} />
          <ModeToggle mode={mode} onClick={toggleMode} />
          <LoginDivider />
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
