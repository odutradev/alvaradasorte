import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

export const CardWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius * 2,
  alignItems: 'center',
  display: 'flex'
}))

export const CardInfo = styled(Box)({
  flex: 1
})

export const InfoGrid = styled(Box)(({ theme }) => ({
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  display: 'grid',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}))

export const CardDates = styled(Box)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(1.5)
}))

export const DateChip = styled(Chip)({
  fontSize: '0.7rem',
  height: 22
})

export const CardActions = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(0.5),
  marginLeft: theme.spacing(2)
}))
