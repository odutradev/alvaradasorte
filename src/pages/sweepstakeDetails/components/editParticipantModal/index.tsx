import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Alert from '@mui/material/Alert'
import { useState, useEffect } from 'react'

import { updateParticipation } from '@services/sweepstakes'
import { FormContainer } from './styles'
import useAction from '@hooks/useAction'

import type { EditParticipantModalProps } from './types'

const EditParticipantModal = ({ participation, sweepstakeId, open, onClose, onSuccess }: EditParticipantModalProps) => {
  const [userName, setUserName] = useState('')
  const [userDepartment, setUserDepartment] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [quotaCount, setQuotaCount] = useState(1)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (participation) {
      setUserName(participation.userName || '')
      setUserDepartment(participation.userDepartment || participation.userSector || participation.sector || '')
      setUserPhone(participation.userPhone || '')
      setQuotaCount(participation.quotaCount ?? 1)
      setErrorMessage(null)
    }
  }, [participation])

  const handleClose = () => {
    setErrorMessage(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!participation) return

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await useAction({
        action: async () => {
          return await updateParticipation(sweepstakeId, participation.id, {
            userName: userName.trim(),
            userDepartment: userDepartment.trim(),
            userPhone: userPhone.trim(),
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
      setErrorMessage(details || 'Ocorreu um erro ao atualizar os dados do participante.')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Editar Participante</DialogTitle>
      <DialogContent dividers>
        <FormContainer>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            label="Nome Completo"
            size="small"
            fullWidth
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            label="Setor / Departamento"
            size="small"
            fullWidth
            required
            value={userDepartment}
            onChange={(e) => setUserDepartment(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            label="Telefone / Contato"
            size="small"
            fullWidth
            required
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            label="Quantidade de Cotas"
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
          disabled={!userName.trim() || isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditParticipantModal
