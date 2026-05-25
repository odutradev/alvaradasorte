import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(3),
  minHeight: 320,
  display: 'flex',
  gap: theme.spacing(2)
}))

export const CardBody = styled(Box)({
  flexDirection: 'column',
  display: 'flex'
})

export const HeaderRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  display: 'flex',
  width: '100%'
})

export const InfoRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const DescriptionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(1)
}))
