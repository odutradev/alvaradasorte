import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)({
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  padding: '16px'
})

export const ThemeToggleWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}))
