import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1)
}))
