import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

import { FormContainer, ModalActions } from './styles'

import type { PresetFormModalProps } from './types'

const PresetFormModal = ({ handleSubmit, register, onClose, onSubmit, open }: PresetFormModalProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <FormContainer component="form" id="preset-form" onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('receiverName')} label="Nome do Recebedor" required fullWidth />
      <TextField {...register('bank')} label="Banco" required fullWidth />
      <TextField {...register('pix')} label="Chave PIX" required fullWidth />
    </FormContainer>
    <ModalActions>
      <Button onClick={onClose} color="inherit">Cancelar</Button>
      <Button type="submit" form="preset-form" variant="contained" color="primary">Salvar</Button>
    </ModalActions>
  </Dialog>
)

export default PresetFormModal
