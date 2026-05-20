import { DialogContent, DialogActions, DialogTitle, TextField, Button, Dialog } from '@mui/material'
import { useForm } from 'react-hook-form'

import { joinSweepstake } from '@core/services/sweepstakes'
import useAction from '@core/hooks/useAction'

import * as S from './styles'

import type { JoinSweepstakeModalProps, JoinFormData } from './types'

export const JoinSweepstakeModal = ({ sweepstakeId, onSuccess, onClose, open }: JoinSweepstakeModalProps) => {
  const { handleSubmit, register, reset } = useForm<JoinFormData>()

  const onSubmit = async (data: JoinFormData) => {
    await useAction({
      action: async () => await joinSweepstake(sweepstakeId, data),
      callback: () => {
        onSuccess()
        onClose()
        reset()
      },
      toastMessages: {
        success: 'Participação registrada!',
        pending: 'Enviando comprovante...',
        error: 'Erro ao participar'
      }
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Participar do Bolão</DialogTitle>
      <DialogContent>
        <S.FormContainer component="form" id="join-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register('receiptUrl')} label="URL do Comprovante" type="url" required fullWidth />
        </S.FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button type="submit" form="join-form" variant="contained" color="primary">
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  )
}