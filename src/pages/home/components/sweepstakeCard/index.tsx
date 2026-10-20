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
  PrizeCardsContainer,
  PrizeCard,
  ActionButtonsRow,
  ActionButton,
  EditButton
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, width: '100%' }}>
            <Typography variant="h6" fontWeight={600} color="primary.main" textAlign="center">
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
        </HeaderRow>

        <PrizeCardsContainer>
          <PrizeCard>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Valor da Cota
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {formatCurrency(data.quotaPrice)}
            </Typography>
          </PrizeCard>

          <PrizeCard>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Prêmio Total
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {formatCurrency(data.prizeValue)}
            </Typography>
          </PrizeCard>

          <PrizeCard isPrimary>
            <Typography variant="caption" color="primary.main" fontWeight={600}>
              Prêmio Atual por Pessoa
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight={700}>
              {formatCurrency(currentPrizePerPerson)}
            </Typography>
          </PrizeCard>

          <PrizeCard>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Prêmio Mínimo por Pessoa
            </Typography>
            <Typography variant="body1" color="text.primary" fontWeight={700}>
              {formatCurrency(minPrizePerPerson)}
            </Typography>
          </PrizeCard>
        </PrizeCardsContainer>

        <QuotaProgress
          availableQuotas={data.availableQuotas}
          filledQuotas={data.metadata.filledQuotas}
        />

        <SweepstakeTimeline
          createdAt={data.createdAt}
          purchaseLimitDate={data.purchaseLimitDate}
          drawDate={data.drawDate}
        />
      </CardBody>

      <ActionButtonsRow>
        <ActionButton
          variant="contained"
          disabled={!isAvailable}
          onClick={() => onJoin(data.id)}
          fullWidth
        >
          {isParticipant && isAvailable ? 'Comprar mais cotas' : isAvailable ? 'Participar' : 'Esgotado / Fechado'}
        </ActionButton>
        {user?.role === 'admin' && (
          <EditButton
            variant="outlined"
            startIcon={<EditOutlinedIcon fontSize="small" />}
            onClick={() => navigate(`/sweepstakes/${data.id}`)}
          >
            Editar
          </EditButton>
        )}
      </ActionButtonsRow>
    </CardContainer>
  )
}

export default SweepstakeCard


