import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2),
  display: 'flex',
  marginTop: 4
}))

export const InstructionBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(2),
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const FileUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.primary.main + '05',
  padding: theme.spacing(2.5),
  transition: 'all 0.2s',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'block',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '10'
  }
}))

export const FileStatusRow = styled(Box)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const ModalTitle = styled(DialogTitle)({
  fontSize: '1.25rem',
  paddingBottom: 8,
  fontWeight: 700
})

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 2.5),
  gap: theme.spacing(1)
}))

export const ConfirmButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  fontWeight: 600
}))

export const CancelButton = styled(Button)({
  fontWeight: 600
})
