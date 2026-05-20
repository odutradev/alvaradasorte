import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  flexDirection: 'column',
  minHeight: '100vh',
  display: 'flex'
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  justifyContent: 'center',
  alignItems: 'flex-start',
  display: 'flex',
  flex: 1
}))