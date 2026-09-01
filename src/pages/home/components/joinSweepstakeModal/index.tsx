import { DialogContent, Typography, IconButton, TextField, Dialog } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import { FileUploadBox, FormContainer, InstructionBox, FileStatusRow, ModalTitle, StyledDialogActions, ConfirmButton, CancelButton, QuantityContainer, QuantityControl, TotalSummaryBox } from './styles'
import { joinSweepstake } from '@services/sweepstakes'
import { formatCurrency } from '@utils/string'
import useAction from '@hooks/useAction'

import type { JoinSweepstakeModalProps, JoinFormData } from './types'

const JoinSweepstakeModal = ({ sweepstakeId, sweepstake, onSuccess, onClose, open }: JoinSweepstakeModalProps) => {
  const { register, handleSubmit, reset } = useForm<JoinFormData>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [quotaCount, setQuotaCount] = useState<number>(1)

  const remainingQuotas = (sweepstake?.availableQuotas ?? 1) - (sweepstake?.metadata?.filledQuotas ?? 0)
  const maxQuotas = Math.max(1, remainingQuotas)
  const quotaPrice = sweepstake?.quotaPrice ?? 0
  const totalPrice = quotaCount * quotaPrice

  const handleClose = () => {
    setSelectedFile(null)
    setQuotaCount(1)
    reset()
    onClose()
  }

  const handleIncrement = () => {
    if (quotaCount < maxQuotas) setQuotaCount((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (quotaCount > 1) setQuotaCount((prev) => prev - 1)
  }

  const onSubmit = async (data: JoinFormData) => {
    if (!data.receipt || data.receipt.length === 0) return
    await useAction({
      action: async () => await joinSweepstake(sweepstakeId, { receipt: data.receipt[0], quotaCount }),
      callback: () => {
        setSelectedFile(null)
        setQuotaCount(1)
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
      <ModalTitle>Participar do Bolão</ModalTitle>
      <DialogContent>
        <FormContainer component="form" id="join-form" onSubmit={handleSubmit(onSubmit)}>
          <QuantityContainer>
            <Typography variant="subtitle2" fontWeight={600}>
              Quantidade de Cotas
            </Typography>
            <QuantityControl>
              <IconButton size="small" onClick={handleDecrement} disabled={quotaCount <= 1}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <TextField
                value={quotaCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  if (isNaN(val)) return
                  if (val >= 1 && val <= maxQuotas) setQuotaCount(val)
                }}
                slotProps={{
                  htmlInput: {
                    style: { textAlign: 'center', padding: '4px 8px', width: '40px' }
                  }
                }}
                size="small"
                variant="outlined"
              />
              <IconButton size="small" onClick={handleIncrement} disabled={quotaCount >= maxQuotas}>
                <AddIcon fontSize="small" />
              </IconButton>
            </QuantityControl>
          </QuantityContainer>

          <TotalSummaryBox>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Valor Total ({quotaCount} {quotaCount === 1 ? 'cota' : 'cotas'}):
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              {formatCurrency(totalPrice)}
            </Typography>
          </TotalSummaryBox>

          <InstructionBox>
            <Typography variant="subtitle2" fontWeight={700} color="primary">
              Como Participar:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              1. Realize o PIX no valor de {formatCurrency(totalPrice)}.
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              2. Tire uma foto ou salve o comprovante da transação.
            </Typography>
            <Typography variant="body2" fontWeight={500}>
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
                setSelectedFile(e.target.files?.[0] ?? null)
              }}
            />
            {selectedFile
              ? (
                <FileStatusRow>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2" fontWeight={700} color="success.main" noWrap>
                    {selectedFile.name}
                  </Typography>
                </FileStatusRow>
              )
              : (
                <FileStatusRow>
                  <CloudUploadIcon color="primary" fontSize="small" />
                  <Typography variant="body2" fontWeight={700}>
                    Selecionar Foto do Comprovante
                  </Typography>
                </FileStatusRow>
              )}
          </FileUploadBox>
        </FormContainer>
      </DialogContent>
      <StyledDialogActions>
        <CancelButton onClick={handleClose} color="inherit" size="medium">
          Cancelar
        </CancelButton>
        <ConfirmButton
          type="submit"
          form="join-form"
          variant="contained"
          color="primary"
          disabled={!selectedFile}
          size="medium"
        >
          Confirmar
        </ConfirmButton>
      </StyledDialogActions>
    </Dialog>
  )
}

export default JoinSweepstakeModal
