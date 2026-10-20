import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2),
  display: 'flex'
}))

export const DateRow = styled(Box)(({ theme }) => ({
  flexDirection: 'row',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}))