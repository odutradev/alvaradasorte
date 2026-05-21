import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { formatCurrency, capitalizeWords } from '@utils/string'
import { CardContainer, DividerLine, InfoRow } from './styles'
import { QuotaProgress } from '@components/quotaProgress'

import type { DetailsCardProps } from './types'

export const DetailsCard = ({ data }: DetailsCardProps) => {
  const collectedValue = (data.participations.length ?? 0) * data.quotaPrice

  return (
    <CardContainer elevation={2}>
      <Typography variant="h6" fontWeight={600} color="primary">
        {capitalizeWords(data.title)}
      </Typography>
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
    </CardContainer>
  )
}