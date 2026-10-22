import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Modal from '@components/modal'

import { FormContainer } from './styles'

import type { PresetFormModalProps } from './types'

const MODAL_LABELS = {
  title: { edit: 'Editar Predefinição', create: 'Nova Predefinição' },
  subtitle: { edit: 'Altere as informações da conta recebedora', create: 'Cadastre os dados da conta recebedora para pagamentos via PIX' },
  submit: { edit: 'Atualizar', create: 'Salvar' }
}

const PresetFormModal = ({ handleSubmit, register, onClose, onSubmit, open, isEditing }: PresetFormModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    maxWidth="md"
    title={isEditing ? MODAL_LABELS.title.edit : MODAL_LABELS.title.create}
    subtitle={isEditing ? MODAL_LABELS.subtitle.edit : MODAL_LABELS.subtitle.create}
    formProps={{
      id: 'preset-form',
      onSubmit: handleSubmit(onSubmit)
    }}
    actions={
      <>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? MODAL_LABELS.submit.edit : MODAL_LABELS.submit.create}
        </Button>
      </>
    }
  >
    <FormContainer>
      <TextField {...register('receiverName')} label="Nome do Recebedor" required fullWidth />
      <TextField {...register('bank')} label="Banco" required fullWidth />
      <TextField {...register('pix')} label="Chave PIX" required fullWidth />
    </FormContainer>
  </Modal>
)

export default PresetFormModal
