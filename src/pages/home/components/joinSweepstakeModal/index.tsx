import { DialogContent, DialogActions, DialogTitle, Typography, Button, Dialog, Box } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import { FileUploadBox, FormContainer, InstructionBox } from './styles'
import { joinSweepstake } from '@services/sweepstakes'
import useAction from '@hooks/useAction'

import type { JoinSweepstakeModalProps, JoinFormData } from './types'

export const JoinSweepstakeModal = ({ sweepstakeId, onSuccess, onClose, open }: JoinSweepstakeModalProps) => {
  const { register, handleSubmit, reset } = useForm<JoinFormData>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleClose = () => {
    setSelectedFile(null)
    reset()
    onClose()
  }

  const onSubmit = async (data: JoinFormData) => {
    if (!data.receipt || data.receipt.length === 0) return
    await useAction({
      action: async () => await joinSweepstake(sweepstakeId, { receipt: data.receipt[0] }),
      callback: () => {
        setSelectedFile(null)
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

  const { onChange, ...restRegister } = register('receipt', { required: true })

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', pb: 1 }}>Participar do Bolão</DialogTitle>
      <DialogContent>
        <FormContainer component="form" id="join-form" onSubmit={handleSubmit(onSubmit)}>
          <InstructionBox>
            <Typography variant="subtitle2" fontWeight={700} color="primary">
              Como Participar:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              1. Realize a transferência PIX no valor correto desta cota.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              2. Tire uma foto ou salve o comprovante da transação.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              3. Toque no botão abaixo para selecionar o comprovante.
            </Typography>
          </InstructionBox>
          <FileUploadBox component="label" htmlFor="receipt-upload">
            <input
              {...restRegister}
              id="receipt-upload"
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                onChange(e)
                const file = e.target.files?.[0] || null
                setSelectedFile(file)
              }}
            />
            {selectedFile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2" fontWeight={700} color="success.main" noWrap>
                  {selectedFile.name}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <CloudUploadIcon color="primary" fontSize="small" />
                <Typography variant="body2" fontWeight={700}>
                  Selecionar Foto do Comprovante
                </Typography>
              </Box>
            )}
          </FileUploadBox>
        </FormContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={handleClose} color="inherit" size="medium" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="join-form"
          variant="contained"
          color="primary"
          disabled={!selectedFile}
          size="medium"
          sx={{ fontWeight: 600, px: 3 }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}