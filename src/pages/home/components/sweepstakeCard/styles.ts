import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  boxSizing: 'border-box'
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

export const DividerLine = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  height: 1,
  width: '100%'
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.2, 2)
}))

