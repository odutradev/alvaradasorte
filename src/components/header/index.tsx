import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

import { HeaderWrapper, StyledAppBar, StyledToolbar, LogoText, NavContainer, AdminNav } from './styles'
import ThemeToggle from '@components/themeToggle'
import useAuth from '@hooks/useAuth'

const Header = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  return (
    <HeaderWrapper>
      <StyledAppBar position="static" elevation={0}>
        <StyledToolbar>
          <LogoText variant="h6" fontWeight={700} color="primary" onClick={() => navigate('/')}>
            AlvaraDaSorte
          </LogoText>
          <NavContainer>
            {user?.role === 'admin' && (
              <AdminNav>
                <Button color="inherit" onClick={() => navigate('/presets')}>
                  Predefinições
                </Button>
                <Button color="inherit" onClick={() => navigate('/sweepstakes')}>
                  Bolões
                </Button>
              </AdminNav>
            )}
            <ThemeToggle />
            {user && (
              <Button variant="contained" color="primary" onClick={logout} endIcon={<LogoutIcon />}>
                Sair
              </Button>
            )}
          </NavContainer>
        </StyledToolbar>
      </StyledAppBar>
    </HeaderWrapper>
  )
}

export default Header