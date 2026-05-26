import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

import { FormContainer, ModalActions } from './styles'

import type { PresetFormModalProps } from './types'

const MODAL_LABELS = {
  title: { edit: 'Editar Predefinição', create: 'Nova Predefinição' },
  submit: { edit: 'Atualizar', create: 'Salvar' }
}

const PresetFormModal = ({ handleSubmit, register, onClose, onSubmit, open, isEditing }: PresetFormModalProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>{isEditing ? MODAL_LABELS.title.edit : MODAL_LABELS.title.create}</DialogTitle>
    <FormContainer component="form" id="preset-form" onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('receiverName')} label="Nome do Recebedor" required fullWidth />
      <TextField {...register('bank')} label="Banco" required fullWidth />
      <TextField {...register('pix')} label="Chave PIX" required fullWidth />
    </FormContainer>
    <ModalActions>
      <Button onClick={onClose} color="inherit">Cancelar</Button>
      <Button type="submit" form="preset-form" variant="contained" color="primary">
        {isEditing ? MODAL_LABELS.submit.edit : MODAL_LABELS.submit.create}
      </Button>
    </ModalActions>
  </Dialog>
)

export default PresetFormModal
