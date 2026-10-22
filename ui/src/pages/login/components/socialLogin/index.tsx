import GoogleIcon from '@mui/icons-material/Google'

import { SocialContainer, SocialButton } from './styles'

import type { SocialLoginProps } from './types'

const SocialLogin = ({ onGoogleLogin }: SocialLoginProps) => (
  <SocialContainer>
    <SocialButton variant="outlined" startIcon={<GoogleIcon />} onClick={onGoogleLogin} fullWidth>
      Google
    </SocialButton>
  </SocialContainer>
)

export default SocialLogin
