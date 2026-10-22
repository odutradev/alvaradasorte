import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const CarouselWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  height: '100%',
  flex: 1,
  minHeight: 0,
  gap: theme.spacing(2)
}))

export const CarouselHeader = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap'
}))

export const NavigationRow = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const CounterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500
}))