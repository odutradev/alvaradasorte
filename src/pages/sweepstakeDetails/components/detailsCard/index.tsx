import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { useState } from 'react'
import dayjs from 'dayjs'

export interface ParticipationResponse {
  sweepstakeId: string
  receiptUrl: string
  createdAt: string
  userName: string
  userId: string
  id: string
}

export interface SweepstakeDetailsResponse {
  purchaseLimitDate: string
  availableQuotas: number
  description: string
  prizeValue: number
  quotaPrice: number
  createdAt: string
  updatedAt: string
  presetId: string
  drawDate: string
  adminId: string
  title: string
  id: string
  participations: ParticipationResponse[]
  metadata: {
    filledQuotas: number
  }
}

export interface DetailsCardProps {
  data: SweepstakeDetailsResponse
}

interface QuotaProgressProps {
  availableQuotas: number
  filledQuotas: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const capitalizeWords = (str: string) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const CardContainer = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2)
}))

const InfoRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

const DividerLine = styled(Box)(({ theme }) => ({
  backgroundColor: theme?.palette?.divider || '#e0e0e0',
  height: '1px',
  width: '100%'
}))

const QuotaProgress = ({ availableQuotas, filledQuotas }: QuotaProgressProps) => {
  const total = availableQuotas
  const percentage = total > 0 ? (filledQuotas / total) * 100 : 0
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Cotas Preenchidas
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {filledQuotas}/{total}
        </Typography>
      </Box>
      <Box sx={{ height: 8, width: '100%', bgcolor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${percentage}%`, bgcolor: 'primary.main', borderRadius: 1 }} />
      </Box>
    </Box>
  )
}

export const DetailsCard = ({ data }: DetailsCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const collectedValue = (data.participations.length ?? 0) * data.quotaPrice
  const handleOpen = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  return (
    <CardContainer elevation={2}>
      <Typography variant="h6" fontWeight={600} color="primary">
        {capitalizeWords(data.title)}
      </Typography>
      {data.description && (
        <Button variant="text" size="small" onClick={handleOpen} sx={{ alignSelf: 'flex-start', p: 0 }}>
          Ver Descrição
        </Button>
      )}
      <DividerLine />
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor da Cota</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(data.quotaPrice)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Total</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(data.prizeValue)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor Arrecadado</Typography>
        <Typography variant="body1" fontWeight={600} color="success.main">
          {formatCurrency(collectedValue)}
        </Typography>
      </InfoRow>
      <DividerLine />
      <QuotaProgress
        availableQuotas={data.availableQuotas}
        filledQuotas={data.participations.length ?? 0}
      />
      <DividerLine />
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Limite de Compra</Typography>
        <Typography variant="body2" fontWeight={500}>
          {dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Data do Sorteio</Typography>
        <Typography variant="body2" fontWeight={500}>
          {dayjs(data.drawDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </InfoRow>
      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{capitalizeWords(data.title)}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {data.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </CardContainer>
  )
}