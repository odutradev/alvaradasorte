import { DialogContent, DialogActions, DialogTitle, TextField, Button, Dialog } from '@mui/material'
import { useForm } from 'react-hook-form'

import { joinSweepstake } from '@services/sweepstakes'
import useAction from '@hooks/useAction'
import { FormContainer } from './styles'

import type { JoinSweepstakeModalProps, JoinFormData } from './types'

export const JoinSweepstakeModal = ({ sweepstakeId, onSuccess, onClose, open }: JoinSweepstakeModalProps) => {
  const { handleSubmit, register, reset } = useForm<JoinFormData>()

  const onSubmit = async (data: JoinFormData) => {
    if (!data.receipt || data.receipt.length === 0) return

    await useAction({
      action: async () => await joinSweepstake(sweepstakeId, { receipt: data.receipt[0] }),
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
        <FormContainer component="form" id="join-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register('receipt')} label="Comprovante de Pagamento" type="file" InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*,application/pdf' }} required fullWidth />
        </FormContainer>
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