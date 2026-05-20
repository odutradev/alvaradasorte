import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CarouselWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const CarouselHeader = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const NavigationRow = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(0.5)
}))

export const CounterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  minWidth: 48,
  textAlign: 'center'
}))

export const EmptyStateWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6, 4),
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex'
}))
