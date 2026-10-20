import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import ListItemButton from '@mui/material/ListItemButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useNavigate, useLocation } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TuneIcon from '@mui/icons-material/Tune'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { useState } from 'react'

import {
  HeaderWrapper,
  StyledAppBar,
  StyledToolbar,
  LogoText,
  NavContainer,
  MenuButton,
  DrawerContent,
  DrawerHeader,
  ThemeSection
} from './styles'
import type { HeaderProps } from './types'
import ThemeToggle from '@components/themeToggle'
import useSystemStore from '@stores/system'
import useAuth from '@hooks/useAuth'

const Header = ({ showBackButton = false, onBack, backLabel = 'Voltar' }: HeaderProps = {}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { system } = useSystemStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isDark = system.themeMode === 'dark'

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <HeaderWrapper>
      <StyledAppBar position="static" elevation={0}>
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {showBackButton && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={handleBack}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'divider',
                  color: 'text.primary',
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                {backLabel}
              </Button>
            )}
            <LogoText variant="h6" fontWeight={700} color="primary" onClick={() => navigate('/')}>
              AlvaraDaSorte
            </LogoText>
          </Box>
          <NavContainer>
            <MenuButton onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
              <MenuIcon />
            </MenuButton>
          </NavContainer>
        </StyledToolbar>
      </StyledAppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent role="presentation">
          <DrawerHeader>
            <Typography variant="subtitle1" fontWeight={700}>
              Menu
            </Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Fechar menu">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ my: 1 }} />
          <List sx={{ px: 0, py: 1, flex: 1 }}>
            {user?.role === 'admin' && (
              <>
                <ListItemButton
                  selected={location.pathname.startsWith('/users')}
                  onClick={() => handleNavigate('/users')}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                    <PeopleOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usuários"
                    primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
                  />
                </ListItemButton>
                <ListItemButton
                  selected={location.pathname.startsWith('/presets')}
                  onClick={() => handleNavigate('/presets')}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                    <TuneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Predefinições"
                    primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
                  />
                </ListItemButton>
                <ListItemButton
                  selected={location.pathname.startsWith('/sweepstakes')}
                  onClick={() => handleNavigate('/sweepstakes')}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                    <CasinoOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bolões"
                    primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
                  />
                </ListItemButton>
              </>
            )}
          </List>
          <ThemeSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                {isDark ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              </Box>
              <Typography variant="body2" fontWeight={500}>
                {isDark ? 'Modo Escuro' : 'Modo Claro'}
              </Typography>
            </Box>
            <ThemeToggle />
          </ThemeSection>
        </DrawerContent>
      </Drawer>
    </HeaderWrapper>
  )
}

export default Header
