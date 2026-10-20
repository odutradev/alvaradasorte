import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import dayjs from 'dayjs'

import { CardContainer, CardBody, HeaderRow, InfoRow, DescriptionText, DividerLine, ActionButton } from './styles'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCurrency } from '@utils/string'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({ onJoin, data }: SweepstakeCardProps) => {
  const isAvailable = data.availableQuotas > data.metadata.filledQuotas && dayjs().isBefore(dayjs(data.purchaseLimitDate))
  const isParticipant = data.userParticipation?.isParticipant ?? false
  const userQuotaCount = data.userParticipation?.quotaCount ?? 0

  const filledQuotas = data.metadata.filledQuotas ?? 0
  const currentPrizePerPerson = filledQuotas > 0 ? data.prizeValue / filledQuotas : 0
  const minPrizePerPerson = data.availableQuotas > 0 ? data.prizeValue / data.availableQuotas : 0

  return (
    <CardContainer elevation={0}>
      <CardBody>
        <HeaderRow>
          <Typography variant="h6" fontWeight={600} color="primary.main">
            {data.title}
          </Typography>
          {isParticipant && (
            <Chip
              label={userQuotaCount > 0 ? `${userQuotaCount} ${userQuotaCount === 1 ? 'cota' : 'cotas'}` : 'Inscrito'}
              color="success"
              size="small"
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
          )}
        </HeaderRow>
        {data.description && (
          <DescriptionText variant="body2" color="text.secondary">
            {data.description}
          </DescriptionText>
        )}
      </CardBody>

      <DividerLine />

      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor da Cota:</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(data.quotaPrice)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Total:</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(data.prizeValue)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Atual por Pessoa:</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(currentPrizePerPerson)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Mínimo por Pessoa:</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(minPrizePerPerson)}
        </Typography>
      </InfoRow>

      <DividerLine />

      <QuotaProgress
        availableQuotas={data.availableQuotas}
        filledQuotas={data.metadata.filledQuotas}
      />

      <DividerLine />

      <InfoRow>
        <Typography variant="body2" color="text.secondary">Limite de Compra:</Typography>
        <Typography variant="body1" fontWeight={600}>
          {dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </InfoRow>
      <ActionButton
        variant="contained"
        disabled={!isAvailable}
        onClick={() => onJoin(data.id)}
        fullWidth
      >
        {isParticipant && isAvailable ? 'Comprar mais cotas' : isAvailable ? 'Participar' : 'Esgotado / Fechado'}
      </ActionButton>
    </CardContainer>
  )
}

export default SweepstakeCard
