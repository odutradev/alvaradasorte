import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@components/modal'

import type { DeleteUserDialogProps } from './types'

const DeleteUserDialog = ({ open, user, loading, onClose, onConfirm }: DeleteUserDialogProps) => {
  const handleConfirm = async () => {
    if (!user) return
    await onConfirm(user.id)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title="Excluir Usuário"
      subtitle="Confirmação de exclusão"
      actions={
        <>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Excluir'}
          </Button>
        </>
      }
    >
      <Typography variant="body2" color="text.secondary">
        Tem certeza de que deseja excluir o usuário{' '}
        <Typography component="span" fontWeight={700} color="text.primary">
          {user?.name || user?.email}
        </Typography>
        ? Esta ação é irreversível.
      </Typography>
    </Modal>
  )
}

export default DeleteUserDialog
