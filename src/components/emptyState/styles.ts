import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const Container = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6, 4),
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(2)
}))

export const IconWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))