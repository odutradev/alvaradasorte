import Typography from '@mui/material/Typography'

import { HeaderContainer } from './styles'

import type { LoginHeaderProps } from './types'

const SUBTITLES = {
  login: 'Faça login para acessar o painel',
  register: 'Crie sua conta gratuitamente'
}

const LoginHeader = ({ mode }: LoginHeaderProps) => (
  <HeaderContainer>
    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
      AlvaraDaSorte
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {SUBTITLES[mode]}
    </Typography>
  </HeaderContainer>
)

export default LoginHeader
