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
  height: '100%',
  width: '100%',
  flex: 1,
  minHeight: 0,
  gap: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  boxSizing: 'border-box',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: 6
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3
  }
}))

export const CardContent = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2),
  flex: 1
}))

export const HeaderRow = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap'
}))

export const NavigationControls = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  marginLeft: 'auto'
}))

export const InfoRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const DescriptionText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5)
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


