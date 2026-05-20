import GoogleIcon from '@mui/icons-material/Google'
import AppleIcon from '@mui/icons-material/Apple'
import { useNavigate } from 'react-router-dom'

import useAction from '../../../../hooks/useAction'
import { useAuth } from '../../../../hooks/useAuth'

import { SocialContainer, SocialButton } from './styles'

export const SocialLogin = () => {
  const { loginWithGoogle, loginWithApple } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (action: () => Promise<void>) => async () => {
    await useAction({
      action,
      callback: () => navigate('/', { replace: true }),
      toastMessages: {
        success: 'Login realizado com sucesso!',
        pending: 'Autenticando...',
        error: 'Ocorreu um erro na autenticação.'
      }
    })
  }

  return (
    <SocialContainer>
      <SocialButton variant="outlined" startIcon={<GoogleIcon />} onClick={handleLogin(loginWithGoogle)} fullWidth>
        Google
      </SocialButton>
      <SocialButton variant="outlined" startIcon={<AppleIcon />} onClick={handleLogin(loginWithApple)} fullWidth>
        Apple
      </SocialButton>
    </SocialContainer>
  )
}