import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
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

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2)
}))
