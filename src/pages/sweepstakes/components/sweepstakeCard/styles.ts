import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 8,
  padding: theme.spacing(3),
  display: 'flex'
}))

export const InfoWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(2)
}))

export const InfoGrid = styled(Box)(({ theme }) => ({
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  display: 'grid',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}))