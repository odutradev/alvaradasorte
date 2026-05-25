import { Navigate } from 'react-router-dom'

import { PageWrapper, ThemeToggleWrapper } from './styles'
import GridBackground from '@components/gridBackground'
import LoginCard from './components/loginCard'
import ThemeToggle from '@components/themeToggle'
import { useLogin } from './hook'

const Login = () => {
  const { isAuthenticated, mode, toggleMode, handleEmailLogin, handleEmailRegister, handleGoogleLogin } = useLogin()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <LoginCard
          onEmailSubmit={mode === 'login' ? handleEmailLogin : handleEmailRegister}
          onGoogleLogin={handleGoogleLogin}
          onToggleMode={toggleMode}
          mode={mode}
        />
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
      </PageWrapper>
    </GridBackground>
  )
}

export default Login
