import GoogleIcon from '@mui/icons-material/Google'
import AppleIcon from '@mui/icons-material/Apple'

import { useAuth } from '@core/hooks/useAuth'
import useAction from '@core/hooks/useAction'
import * as S from './styles'

export const SocialLogin = () => {
  const { loginWithGoogle, loginWithApple } = useAuth()

  const handleGoogle = async () => {
    await useAction({
      action: loginWithGoogle,
      toastMessages: {
        success: 'Login com Google realizado!',
        pending: 'Redirecionando para o Google...',
        error: 'Erro no login com Google.'
      }
    })
  }

  const handleApple = async () => {
    await useAction({
      action: loginWithApple,
      toastMessages: {
        success: 'Login com Apple realizado!',
        pending: 'Redirecionando para a Apple...',
        error: 'Erro no login com Apple.'
      }
    })
  }

  return (
    <S.SocialContainer>
      <S.SocialButton variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogle} fullWidth>
        Google
      </S.SocialButton>
      <S.SocialButton variant="outlined" startIcon={<AppleIcon />} onClick={handleApple} fullWidth>
        Apple
      </S.SocialButton>
    </S.SocialContainer>
  )
}