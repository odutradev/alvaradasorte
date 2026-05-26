import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2)
}))

export const DividerLine = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  height: '1px',
  width: '100%'
}))

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(2)
}))

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3)
}))

export const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontFamily: 'monospace',
    fontSize: '0.875rem'
  },
  backgroundColor: 'transparent'
})

export const StyledTextButton = styled(Button)({
  alignSelf: 'flex-start',
  padding: 0
})