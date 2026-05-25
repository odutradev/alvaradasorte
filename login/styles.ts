import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
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

export const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  flexDirection: 'column',
  maxWidth: 480,
  width: '100%',
  display: 'flex'
}))

export const ThemeToggleWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}))
