import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)({
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  padding: '16px'
})

export const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  flexDirection: 'column',
  maxWidth: 480,
  width: '100%',
  display: 'flex',
  gap: theme.spacing(2.5)
}))

export const HeaderContainer = styled(Box)({
  textAlign: 'center'
})

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(0.5)
}))

export const ThemeToggleWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}))
