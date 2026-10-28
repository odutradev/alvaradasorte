import { useState } from 'react'

import ForgotPasswordModal from '../forgotPasswordModal'
import LoginDivider from '../loginDivider'
import { CardContainer } from './styles'
import LoginHeader from '../loginHeader'
import SocialLogin from '../socialLogin'
import ModeToggle from '../modeToggle'
import LoginForm from '../loginForm'

import type { LoginCardProps } from './types'

const LoginCard = ({ mode, onToggleMode, onEmailSubmit, onGoogleLogin }: LoginCardProps) => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [prefilledEmail, setPrefilledEmail] = useState('')

  const handleOpenForgotPassword = (currentEmail?: string) => {
    setPrefilledEmail(currentEmail ?? '')
    setForgotPasswordOpen(true)
  }

  return (
    <>
      <CardContainer elevation={3}>
        <LoginHeader mode={mode} />
        <LoginForm
          onSubmit={onEmailSubmit}
          onForgotPassword={handleOpenForgotPassword}
          mode={mode}
        />
        <ModeToggle mode={mode} onToggle={onToggleMode} />
        <LoginDivider />
        <SocialLogin onGoogleLogin={onGoogleLogin} />
      </CardContainer>
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        initialEmail={prefilledEmail}
      />
    </>
  )
}

export default LoginCard
