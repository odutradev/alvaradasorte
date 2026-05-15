import { DialogContentText, DialogActions, DialogContent, DialogTitle, Button, Dialog } from '@mui/material'

import type { ConfirmationModalProps } from './types'

const ConfirmationModal = ({ confirmColor = 'primary', cancelColor = 'inherit', confirmText = 'Confirmar', cancelText = 'Cancelar', description, onConfirm, onCancel, title, open }: ConfirmationModalProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ p: 2, pt: 0 }}>
      <Button onClick={onCancel} color={cancelColor}>
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color={confirmColor} variant="contained">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmationModal