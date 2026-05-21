import GoogleIcon from '@mui/icons-material/Google'
import AppleIcon from '@mui/icons-material/Apple'

import { SocialContainer, SocialButton } from './styles'

import type { SocialLoginProps } from './types'

const SocialLogin = ({ onGoogleLogin, onAppleLogin }: SocialLoginProps) => (
  <SocialContainer>
    <SocialButton variant="outlined" startIcon={<GoogleIcon />} onClick={onGoogleLogin} fullWidth>
      Google
    </SocialButton>
    {/* <SocialButton variant="outlined" startIcon={<AppleIcon />} onClick={onAppleLogin} fullWidth>
      Apple
    </SocialButton> */}
  </SocialContainer>
)

export default SocialLogin
