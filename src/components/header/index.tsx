import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import { useState } from 'react'

import { HeaderWrapper, StyledAppBar, StyledToolbar, LogoText, NavContainer, AdminNav, DesktopLogout, MobileMenuButton, DrawerContent } from './styles'
import ThemeToggle from '@components/themeToggle'
import useAuth from '@hooks/useAuth'

const Header = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const handleLogout = () => {
    logout()
    setDrawerOpen(false)
  }

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
              <DesktopLogout variant="contained" color="primary" onClick={logout} endIcon={<LogoutIcon />}>
                Sair
              </DesktopLogout>
            )}
            {user && (
              <MobileMenuButton onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
                <MenuIcon />
              </MobileMenuButton>
            )}
          </NavContainer>
        </StyledToolbar>
      </StyledAppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent role="presentation">
          <List>
            {user?.role === 'admin' && (
              <>
                <ListItemButton onClick={() => handleNavigate('/presets')}>
                  <ListItemText primary="Predefinições" />
                </ListItemButton>
                <ListItemButton onClick={() => handleNavigate('/sweepstakes')}>
                  <ListItemText primary="Bolões" />
                </ListItemButton>
                <Divider />
              </>
            )}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </List>
        </DrawerContent>
      </Drawer>
    </HeaderWrapper>
  )
}

export default Header
