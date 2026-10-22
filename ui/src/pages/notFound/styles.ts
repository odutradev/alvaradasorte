import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  display: 'flex',
  padding: theme.spacing(3)
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))