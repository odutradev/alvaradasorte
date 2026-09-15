import CircularProgress from '@mui/material/CircularProgress'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

import { StyledDialogContentText } from './styles'

import type { DeleteUserDialogProps } from './types'

const DeleteUserDialog = ({ open, user, loading, onClose, onConfirm }: DeleteUserDialogProps) => {
  const handleConfirm = async () => {
    if (!user) return
    await onConfirm(user.id)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir Usuário</DialogTitle>
      <DialogContent>
        <StyledDialogContentText>
          Tem certeza de que deseja excluir o usuário{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {user?.name || user?.email}
          </Typography>
          ? Esta ação é irreversível.
        </StyledDialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUserDialog
