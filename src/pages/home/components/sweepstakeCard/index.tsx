import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { CardContainer, HeaderRow, InfoRow } from './styles'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCurrency } from '@utils/string'

import type { SweepstakeCardProps } from './types'

export const SweepstakeCard = ({ onJoin, data }: SweepstakeCardProps) => {
  const isAvailable = data.availableQuotas > data.metadata.filledQuotas && dayjs().isBefore(dayjs(data.purchaseLimitDate))
  const isParticipant = data.userParticipation?.isParticipant ?? false

  return (
    <CardContainer elevation={2}>
      <Box>
        <HeaderRow>
          <Typography variant="h6" fontWeight={600}>
            {data.title}
          </Typography>
          {isParticipant && (
            <Chip
              label={data.userParticipation?.joinedAt ? `Inscrito ${dayjs(data.userParticipation.joinedAt).format('DD/MM')}` : 'Inscrito'}
              color="success"
              size="small"
                />
              )}
        </HeaderRow>
        {data.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
            {data.description}
          </Typography>
        )}
      </Box>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor da Cota:</Typography>
        <Typography variant="body1" fontWeight={500}>
          {formatCurrency(data.quotaPrice)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Total:</Typography>
        <Typography variant="body1" fontWeight={500}>
          {formatCurrency(data.prizeValue)}
        </Typography>
      </InfoRow>
      <QuotaProgress
        availableQuotas={data.availableQuotas}
        filledQuotas={data.metadata.filledQuotas}
      />
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Limite de Compra:</Typography>
        <Typography variant="body1" fontWeight={500}>
          {dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </InfoRow>
      <Button
        variant="contained"
        disabled={!isAvailable || isParticipant}
        onClick={() => onJoin(data.id)}
        fullWidth
      >
        {isParticipant ? 'Já Inscrito' : isAvailable ? 'Participar' : 'Esgotado / Fechado'}
      </Button>
    </CardContainer>
  )
}