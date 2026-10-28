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

export const ForgotPasswordRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(-1)
}))

export const ForgotPasswordButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 500,
  padding: '2px 4px',
  minWidth: 'auto'
})
