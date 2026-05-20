import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  display: 'flex'
}))

export const InfoRow = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
}))