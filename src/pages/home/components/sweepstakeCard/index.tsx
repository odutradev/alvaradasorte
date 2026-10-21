import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
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
  EditButton,
  GamesFlowContainer,
  GameChip,
  ChipNumber
} from './styles'
import SweepstakeTimeline from '@components/sweepstakeTimeline'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCompactCurrency } from '@utils/string'
import useCountUp from '@hooks/useCountUp'
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

  const animatedQuotaPrice = useCountUp(data.quotaPrice)
  const animatedPrizeValue = useCountUp(data.prizeValue)
  const animatedCurrentPrize = useCountUp(currentPrizePerPerson)
  const animatedMinPrize = useCountUp(minPrizePerPerson)

  const games = data.games ?? []
  const resultSet = useMemo(() => new Set(data.result ?? []), [data.result])

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
              {formatCompactCurrency(animatedQuotaPrice)}
            </Typography>
          </PrizeCard>

          <PrizeCard>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Prêmio Total
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {formatCompactCurrency(animatedPrizeValue)}
            </Typography>
          </PrizeCard>

          <PrizeCard isPrimary>
            <Typography variant="caption" color="primary.main" fontWeight={600}>
              Prêmio Atual por Pessoa
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight={700}>
              {formatCompactCurrency(animatedCurrentPrize)}
            </Typography>
          </PrizeCard>

          <PrizeCard>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Prêmio Mínimo por Pessoa
            </Typography>
            <Typography variant="body1" color="text.primary" fontWeight={700}>
              {formatCompactCurrency(animatedMinPrize)}
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

        {games.length > 0 && (
          <GamesFlowContainer>
            {games.map((game, idx) => (
              <GameChip key={idx}>
                <Typography
                  component="span"
                  sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', mr: 0.25 }}
                >
                  #{idx + 1}
                </Typography>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                  {game.map((num, nIdx) => (
                    <ChipNumber key={nIdx} matched={resultSet.has(num)}>
                      {num < 10 ? `0${num}` : num}
                    </ChipNumber>
                  ))}
                </Box>
              </GameChip>
            ))}
          </GamesFlowContainer>
        )}
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


