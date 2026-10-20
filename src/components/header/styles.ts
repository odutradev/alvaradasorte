import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.8)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(12px)',
  borderRadius: theme.shape.borderRadius * 2,
  color: theme.palette.text.primary,
  overflow: 'hidden'
}))

export const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const LogoText = styled(Typography)({
  transition: 'opacity 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
})

export const NavContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(2),
  display: 'flex'
}))

export const MenuButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  padding: theme.spacing(0.75),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main
  }
}))

export const DrawerContent = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  boxSizing: 'border-box'
}))

export const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const ThemeSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.action.hover,
  marginTop: 'auto'
}))
