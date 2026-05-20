import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(4),
  maxWidth: 1000,
  margin: '0 auto',
  display: 'flex',
  gap: theme.spacing(3)
}))

export const ListContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))