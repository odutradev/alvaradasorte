import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const Container = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(1)
}))

export const RowContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(3)
}))