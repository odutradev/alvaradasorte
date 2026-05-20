import LogoutIcon from '@mui/icons-material/Logout'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import * as S from './styles'

import type { HeaderProps } from './types'

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <S.StyledAppBar position="static">
      <S.StyledToolbar>
        <Typography variant="h6" fontWeight={700}>
          Uailab Dashboard
        </Typography>
        <Button variant="outlined" color="primary" onClick={onLogout} endIcon={<LogoutIcon />}>
          Sair
        </Button>
      </S.StyledToolbar>
    </S.StyledAppBar>
  )
}