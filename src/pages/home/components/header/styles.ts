import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
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

export const NavContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(2),
  display: 'flex'
}))

export const AdminNav = styled(Box)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  paddingRight: theme.spacing(2),
  alignItems: 'center',
  gap: theme.spacing(1),
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))