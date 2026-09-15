import { styled } from '@mui/material/styles'
import DialogContent from '@mui/material/DialogContent'

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  paddingTop: `${theme.spacing(2)} !important`
}))
