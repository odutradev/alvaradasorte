import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import ThemeToggle from '@components/themeToggle'
import * as S from './styles'

import type { HeaderProps } from './types'

export const Header = ({ onLogout, userRole }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <S.HeaderWrapper>
      <S.StyledAppBar position="static" elevation={0}>
        <S.StyledToolbar>
          <Typography variant="h6" fontWeight={700} color="primary">
            AlvaraDaSorte
          </Typography>
          <S.NavContainer>
            {userRole === 'admin' && (
              <S.AdminNav>
                <Button color="inherit" onClick={() => navigate('/admin/presets')}>
                  Predefinições
                </Button>
                <Button color="inherit" onClick={() => navigate('/admin/sweepstakes')}>
                  Bolões
                </Button>
              </S.AdminNav>
            )}
            <ThemeToggle />
            <Button variant="contained" color="primary" onClick={onLogout} endIcon={<LogoutIcon />}>
              Sair
            </Button>
          </S.NavContainer>
        </S.StyledToolbar>
      </S.StyledAppBar>
    </S.HeaderWrapper>
  )
}