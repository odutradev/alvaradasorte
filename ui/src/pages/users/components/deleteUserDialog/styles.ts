import { styled } from '@mui/material/styles'
import DialogContentText from '@mui/material/DialogContentText'

export const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.secondary
}))
