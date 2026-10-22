import LoginDivider from '../loginDivider'
import { CardContainer } from './styles'
import LoginHeader from '../loginHeader'
import SocialLogin from '../socialLogin'
import ModeToggle from '../modeToggle'
import LoginForm from '../loginForm'

import type { LoginCardProps } from './types'

const LoginCard = ({ mode, onToggleMode, onEmailSubmit, onGoogleLogin }: LoginCardProps) => (
  <CardContainer elevation={3}>
    <LoginHeader mode={mode} />
    <LoginForm onSubmit={onEmailSubmit} mode={mode} />
    <ModeToggle mode={mode} onToggle={onToggleMode} />
    <LoginDivider />
    <SocialLogin onGoogleLogin={onGoogleLogin} />
  </CardContainer>
)

export default LoginCard
