import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import * as S from './styles'

import type { HeaderProps } from './types'

export const Header = ({ onLogout, userRole }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <S.StyledAppBar position="static">
      <S.StyledToolbar>
        <Typography variant="h6" fontWeight={700}>
          Uailab Dashboard
        </Typography>
        <S.NavContainer>
          {userRole === 'admin' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/presets')}>
                Predefinições
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/sweepstakes')}>
                Bolões Admin
              </Button>
            </>
          )}
          <Button variant="outlined" color="primary" onClick={onLogout} endIcon={<LogoutIcon />}>
            Sair
          </Button>
        </S.NavContainer>
      </S.StyledToolbar>
    </S.StyledAppBar>
  )
}