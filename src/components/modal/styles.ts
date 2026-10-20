import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper:not(.MuiDialog-paperFullScreen)': {
    borderRadius: Number(theme.shape.borderRadius) * 3,
    maxHeight: '90vh'
  },
  '& .MuiDialog-paper': {
    display: 'flex',
    flexDirection: 'column'
  }
}))

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: theme.spacing(2.5, 3, 1.5, 3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

export const ModalBody = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  padding: theme.spacing(2.5, 3),
  flex: 1,
  overflowY: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
}))

export const ModalFooter = styled(DialogActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`
}))
