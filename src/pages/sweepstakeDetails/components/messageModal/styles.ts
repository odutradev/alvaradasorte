import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(2)
}))

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3)
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.palette.primary.main} transparent`,
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '4px',
      border: `2px solid ${theme.palette.background.paper || '#ffffff'}`
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.palette.primary.dark || '#624cab'
    }
  },
  backgroundColor: 'transparent'
}))