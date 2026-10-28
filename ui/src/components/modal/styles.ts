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
  '& .MuiDialog-paper.MuiDialog-paperFullScreen': {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    margin: 0,
    borderRadius: 0
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
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0
}))

export const ModalBody = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  padding: theme.spacing(2.5, 3),
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
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
  borderTop: `1px solid ${theme.palette.divider}`,
  flexShrink: 0
}))
