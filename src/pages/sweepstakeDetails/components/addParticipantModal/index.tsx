import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Alert from '@mui/material/Alert'
import { useState } from 'react'

import { addManualParticipation } from '@services/sweepstakes'
import { FormContainer } from './styles'
import useAction from '@hooks/useAction'

import type { AddParticipantModalProps } from './types'

const AddParticipantModal = ({ open, sweepstakeId, onClose, onSuccess }: AddParticipantModalProps) => {
  const [email, setEmail] = useState('')
  const [quotaCount, setQuotaCount] = useState(1)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setEmail('')
    setQuotaCount(1)
    setErrorMessage(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!email.trim()) return

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await useAction({
        action: async () => {
          return await addManualParticipation(sweepstakeId, {
            email: email.trim(),
            quotaCount: Number(quotaCount) || 1
          })
        },
        callback: () => {
          handleClose()
          onSuccess()
        }
      })
    } catch (error: unknown) {
      const details = (error as { response?: { data?: { details?: string } } })?.response?.data?.details
      setErrorMessage(details || 'Ocorreu um erro ao adicionar o participante.')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Adicionar Participante</DialogTitle>
      <DialogContent dividers>
        <FormContainer>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            label="E-mail da pessoa"
            type="email"
            placeholder="exemplo@dominio.com"
            size="small"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            label="Quantidade de cotas"
            type="number"
            size="small"
            fullWidth
            inputProps={{ min: 1 }}
            value={quotaCount}
            onChange={(e) => setQuotaCount(Math.max(1, Number(e.target.value)))}
            disabled={isSubmitting}
          />
        </FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!email.trim() || isSubmitting}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddParticipantModal
