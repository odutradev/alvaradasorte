import { DialogActions, TextField, Button, Dialog } from '@mui/material'

import { FormContainer } from './styles'

import type { PresetFormModalProps } from './types'

const PresetFormModal = ({ handleSubmit, register, onClose, onSubmit, open }: PresetFormModalProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <FormContainer component="form" id="preset-form" onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('description')} label="Descrição" required fullWidth multiline rows={4} />
      <TextField {...register('pix')} label="Chave PIX" required fullWidth />
      <TextField {...register('receiverName')} label="Nome do Recebedor" required fullWidth />
      <TextField {...register('bank')} label="Banco" required fullWidth />
    </FormContainer>
    <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
      <Button onClick={onClose} color="inherit">Cancelar</Button>
      <Button type="submit" form="preset-form" variant="contained" color="primary">Salvar</Button>
    </DialogActions>
  </Dialog>
)

export default PresetFormModal