import { DialogContent, DialogActions, DialogTitle, Typography, Button, Dialog, Alert, Box } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import { FileUploadBox, FormContainer, StepBadge, StepBox, PixBox } from './styles'
import { joinSweepstake } from '@services/sweepstakes'
import { formatCurrency } from '@utils/string'
import useAction from '@hooks/useAction'

import type { JoinSweepstakeModalProps, JoinFormData } from './types'

const PIX_KEY = 'pix@alvaradasorte.com.br'

export const JoinSweepstakeModal = ({ sweepstake, onSuccess, onClose, open }: JoinSweepstakeModalProps) => {
  const { register, handleSubmit, reset } = useForm<JoinFormData>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyPix = () => {
    const input = document.createElement('input')
    input.value = PIX_KEY
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setSelectedFile(null)
    reset()
    onClose()
  }

  const onSubmit = async (data: JoinFormData) => {
    if (!sweepstake || !data.receipt || data.receipt.length === 0) return

    await useAction({
      action: async () => await joinSweepstake(sweepstake.id, { receipt: data.receipt[0] }),
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Participar do Bolão</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Siga os passos simples abaixo para confirmar sua participação no bolão.
        </Typography>
        <FormContainer component="form" id="join-form" onSubmit={handleSubmit(onSubmit)}>
          <StepBox>
            <StepBadge>1</StepBadge>
            <Typography variant="h6" fontWeight={700}>
              Copie a Chave PIX e o Valor
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              Valor por cota: <strong>{sweepstake ? formatCurrency(sweepstake.quotaPrice) : ''}</strong>
            </Typography>
            <PixBox elevation={0}>
              <Typography variant="body1" fontWeight={700} sx={{ wordBreak: 'break-all' }}>
                {PIX_KEY}
              </Typography>
              <Button
                variant="contained"
                size="medium"
                startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                onClick={handleCopyPix}
                sx={{ minWidth: 140 }}
                color={copied ? 'success' : 'primary'}
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </PixBox>
          </StepBox>
          <StepBox>
            <StepBadge>2</StepBadge>
            <Typography variant="h6" fontWeight={700}>
              Faça a Transferência
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Abra o aplicativo do seu banco no celular, escolha a opção PIX e realize o pagamento do valor informado.
            </Typography>
          </StepBox>
          <StepBox>
            <StepBadge>3</StepBadge>
            <Typography variant="h6" fontWeight={700}>
              Envie o Comprovante
            </Typography>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="success.main">
                    Comprovante Selecionado!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {selectedFile.name}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Clique aqui para selecionar o comprovante
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tire uma foto ou envie o arquivo PDF do comprovante
                  </Typography>
                </Box>
              )}
            </FileUploadBox>
          </StepBox>
        </FormContainer>
      </DialogContent>
      <DialogActions sx={{ padding: 3, gap: 1 }}>
        <Button onClick={handleClose} color="inherit" size="large" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="join-form"
          variant="contained"
          color="primary"
          disabled={!selectedFile}
          size="large"
          sx={{ fontWeight: 600, minWidth: 120 }}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  )
}