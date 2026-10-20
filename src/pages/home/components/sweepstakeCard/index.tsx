import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import {
  CardContainer,
  CardBody,
  HeaderRow,
  InfoRow,
  DescriptionText,
  DividerLine,
  ActionButton
} from './styles'
import SweepstakeTimeline from '@components/sweepstakeTimeline'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCurrency } from '@utils/string'
import useAuth from '@hooks/useAuth'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({ onJoin, data }: SweepstakeCardProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, mr: 1 }}>
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
          </Box>
          {user?.role === 'admin' && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditOutlinedIcon fontSize="small" />}
              onClick={() => navigate(`/sweepstakes/${data.id}`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                flexShrink: 0
              }}
            >
              Editar
            </Button>
          )}
        </HeaderRow>

        {data.description && (
          <DescriptionText variant="body2" color="text.secondary">
            {data.description}
          </DescriptionText>
        )}

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

        <SweepstakeTimeline
          createdAt={data.createdAt}
          purchaseLimitDate={data.purchaseLimitDate}
          drawDate={data.drawDate}
        />
      </CardBody>

      <ActionButton
        variant="contained"
        disabled={!isAvailable}
        onClick={() => onJoin(data.id)}
        fullWidth
        sx={{ mt: 2 }}
      >
        {isParticipant && isAvailable ? 'Comprar mais cotas' : isAvailable ? 'Participar' : 'Esgotado / Fechado'}
      </ActionButton>
    </CardContainer>
  )
}

export default SweepstakeCard


