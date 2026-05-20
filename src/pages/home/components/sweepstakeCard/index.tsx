import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'

import * as S from './styles'

import type { SweepstakeCardProps } from './types'

export const SweepstakeCard = ({ onJoin, data }: SweepstakeCardProps) => {
  const isAvailable = data.availableQuotas > 0 && dayjs().isBefore(dayjs(data.purchaseLimitDate))

  return (
    <S.CardContainer elevation={2}>
      <Typography variant="h6" fontWeight={600}>
        {data.title}
      </Typography>
      <S.InfoRow>
        <Typography variant="body2" color="text.secondary">Valor da Cota:</Typography>
        <Typography variant="body1" fontWeight={500}>R$ {data.quotaPrice.toFixed(2)}</Typography>
      </S.InfoRow>
      <S.InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Total:</Typography>
        <Typography variant="body1" fontWeight={500}>R$ {data.prizeValue.toFixed(2)}</Typography>
      </S.InfoRow>
      <S.InfoRow>
        <Typography variant="body2" color="text.secondary">Cotas Disponíveis:</Typography>
        <Typography variant="body1" fontWeight={500}>{data.availableQuotas}</Typography>
      </S.InfoRow>
      <S.InfoRow>
        <Typography variant="body2" color="text.secondary">Limite de Compra:</Typography>
        <Typography variant="body1" fontWeight={500}>
          {dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </S.InfoRow>
      <Button variant="contained" disabled={!isAvailable} onClick={() => onJoin(data.id)} fullWidth>
        {isAvailable ? 'Participar' : 'Esgotado / Fechado'}
      </Button>
    </S.CardContainer>
  )
}