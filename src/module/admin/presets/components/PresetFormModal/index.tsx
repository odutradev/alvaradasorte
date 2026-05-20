import { DialogContent, DialogActions, DialogTitle, TextField, Button, Dialog } from '@mui/material'
import { useForm } from 'react-hook-form'

import { createPreset } from '@core/services/presets'
import useAction from '@core/hooks/useAction'

import * as S from './styles'

import type { PresetFormModalProps, PresetFormData } from './types'

export const PresetFormModal = ({ onSuccess, onClose, open }: PresetFormModalProps) => {
  const { handleSubmit, register, reset } = useForm<PresetFormData>()

  const onSubmit = async (data: PresetFormData) => {
    await useAction({
      action: async () => await createPreset(data),
      callback: () => {
        onSuccess()
        onClose()
        reset()
      },
      toastMessages: { success: 'Predefinição criada!', pending: 'Salvando...', error: 'Erro ao criar' }
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nova Predefinição</DialogTitle>
      <DialogContent>
        <S.FormContainer component="form" id="preset-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register('description')} label="Descrição" required fullWidth />
          <TextField {...register('pix')} label="Chave PIX" required fullWidth />
          <TextField {...register('receiverName')} label="Nome do Recebedor" required fullWidth />
          <TextField {...register('bank')} label="Banco" required fullWidth />
        </S.FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button type="submit" form="preset-form" variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}