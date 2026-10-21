import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { useState, useMemo } from 'react'

import { CardContainer, InfoWrapper, InfoGrid, ActionsWrapper, GamesPreviewWrapper, MiniNumberChip } from './styles'
import { QuotaProgress } from '@components/quotaProgress'
import { getLotteryMeta } from '@services/lotteries'
import { formatCurrency } from '@utils/string'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({ sweepstake, onViewDetails, onEdit, onDelete }: SweepstakeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const meta = getLotteryMeta(sweepstake.lotteryType)

  const games = sweepstake.games ?? []
  const resultSet = useMemo(() => new Set(sweepstake.result ?? []), [sweepstake.result])
  const displayedGames = isExpanded ? games : games.slice(0, 2)

  return (
    <CardContainer elevation={0}>
      <InfoWrapper>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={600}>
            {sweepstake.title}
          </Typography>
          {sweepstake.lotteryType && meta && (
            <Chip
              label={meta.name}
              size="small"
              sx={{
                backgroundColor: meta.color,
                color: '#fff',
                fontWeight: 700,
                height: 22,
                fontSize: '0.75rem'
              }}
            />
          )}
          {sweepstake.contestNumber && (
            <Chip
              label={`Concurso nº ${sweepstake.contestNumber}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, height: 22, fontSize: '0.75rem' }}
            />
          )}
        </Box>
        {sweepstake.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: -0.5 }}>
            {sweepstake.description}
          </Typography>
        )}
      <QuotaProgress
        availableQuotas={sweepstake.availableQuotas}
        filledQuotas={sweepstake.metadata?.filledQuotas ?? 0}
      />
      <InfoGrid>
        <Typography variant="body2" color="text.secondary">
          <strong>Valor do Prêmio:</strong> {formatCurrency(sweepstake.prizeValue)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Sorteio:</strong> {dayjs(sweepstake.drawDate).format('DD/MM/YYYY')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Valor Arrecadado:</strong> {formatCurrency((sweepstake.metadata?.filledQuotas ?? 0) * sweepstake.quotaPrice)}
        </Typography>
      </InfoGrid>

      {games.length > 0 && (
        <GamesPreviewWrapper>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              Jogos do Bolão ({games.length})
            </Typography>
            {games.length > 2 && (
              <Typography
                variant="caption"
                color="primary"
                onClick={() => setIsExpanded((prev) => !prev)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {isExpanded ? 'Recolher' : `+${games.length - 2} jogos`}
              </Typography>
            )}
          </Box>

          {displayedGames.map((game, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ minWidth: 20 }}>
                #{idx + 1}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                {game.map((num, nIdx) => {
                  const isMatched = resultSet.has(num)
                  return (
                    <MiniNumberChip key={nIdx} matched={isMatched}>
                      {num < 10 ? `0${num}` : num}
                    </MiniNumberChip>
                  )
                })}
              </Box>
            </Box>
          ))}
        </GamesPreviewWrapper>
      )}
    </InfoWrapper>
    <ActionsWrapper>
      <Tooltip title="Editar bolão">
        <IconButton color="primary" onClick={() => onEdit(sweepstake)} size="small">
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir bolão">
        <IconButton color="error" onClick={() => onDelete(sweepstake)} size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver detalhes">
        <IconButton color="info" onClick={() => onViewDetails(sweepstake.id)} size="small">
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ActionsWrapper>
  </CardContainer>
  )
}

export default SweepstakeCard