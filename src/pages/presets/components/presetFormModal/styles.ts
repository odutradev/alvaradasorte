import { styled } from '@mui/material/styles'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2),
  display: 'flex',
  padding: theme.spacing(3, 3, 2, 3)
}))

export const ModalActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3)
}))
