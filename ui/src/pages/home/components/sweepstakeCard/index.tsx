import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CheckIcon from '@mui/icons-material/Check'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import { useMemo } from 'react'
import Tooltip from '@mui/material/Tooltip'
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
import { formatCompactCurrency, formatCurrency } from '@utils/string'
import { QuotaProgress } from '@components/quotaProgress'
import { getGamePrice } from '@utils/lotteryRules'
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
  const resultNumbers = useMemo(() => (data.result ?? []).map(Number), [data.result])
  const resultSet = useMemo(() => new Set(resultNumbers), [resultNumbers])

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

        {resultNumbers.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? alpha('#16a34a', 0.12) : alpha('#16a34a', 0.08),
              border: (theme) => `1px solid ${alpha('#16a34a', 0.3)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" fontWeight={700} color="success.main">
                Dezenas Sorteadas (Resultado Oficial):
              </Typography>
              {data.contestNumber && (
                <Chip
                  label={`Concurso #${data.contestNumber}`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {resultNumbers.map((num, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.4)'
                  }}
                >
                  {num < 10 ? `0${num}` : num}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {games.length > 0 && (
          <GamesFlowContainer>
            {games.map((game, idx) => {
              const gamePrice = getGamePrice(data.lotteryType, game.length)
              const hits = game.filter((num) => resultSet.has(Number(num))).length
              return (
                <Tooltip
                  key={idx}
                  title={`Jogo de ${game.length} dezenas • Valor: ${formatCurrency(gamePrice)}${hits > 0 ? ` • ${hits} acerto(s)!` : ''}`}
                  arrow
                  placement="top"
                >
                  <GameChip hasHits={hits > 0} sx={{ cursor: 'pointer' }}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: hits > 0 ? 'success.main' : 'text.secondary',
                        mr: 0.25
                      }}
                    >
                      #{idx + 1}
                    </Typography>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                      {game.map((num, nIdx) => (
                        <ChipNumber key={nIdx} matched={resultSet.has(Number(num))}>
                          {Number(num) < 10 ? `0${Number(num)}` : num}
                        </ChipNumber>
                      ))}
                    </Box>
                    {hits > 0 && (
                      <Chip
                        size="small"
                        color="success"
                        label={`${hits} ${hits === 1 ? 'acerto' : 'acertos'}`}
                        icon={<CheckIcon sx={{ fontSize: '0.75rem !important' }} />}
                        sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800, ml: 0.25 }}
                      />
                    )}
                  </GameChip>
                </Tooltip>
              )
            })}
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


