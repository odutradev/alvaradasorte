import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const LoadingContainer = styled(Box)({
  display: 'flex',
  flex: 1,
  minHeight: '90vh',
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box'
})

export const LoadingMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 500
}))