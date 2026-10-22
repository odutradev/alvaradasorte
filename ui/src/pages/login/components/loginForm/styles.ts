import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1)
}))