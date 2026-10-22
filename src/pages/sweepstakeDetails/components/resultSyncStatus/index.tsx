import { useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SyncIcon from '@mui/icons-material/Sync'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import {
  SyncContainer,
  SyncHeader,
  InfoStatsGrid,
  StatBox,
  AttemptsList,
  AttemptItem
} from './styles'

import type { SweepstakeResponse } from '@services/sweepstakes/types'

interface ResultSyncStatusProps {
  sweepstake: SweepstakeResponse
}

export const ResultSyncStatus = ({ sweepstake }: ResultSyncStatusProps) => {
  const [showHistory, setShowHistory] = useState(false)

  const syncLog = sweepstake.resultSyncLog
  const hasResult = Boolean(sweepstake.result && sweepstake.result.length > 0)

  // Se o bolão não tem modalidade de loteria configurada, não há rotina da Caixa
  if (!sweepstake.lotteryType) {
    return null
  }

  const drawTime = dayjs(sweepstake.drawDate)
  const scheduledFirstAttempt = drawTime.isValid() ? drawTime.add(15, 'minute') : null
  const isPastFirstAttempt = scheduledFirstAttempt ? dayjs().isAfter(scheduledFirstAttempt) : false

  // Status visual
  const isSuccess = syncLog?.status === 'success' || hasResult
  const isFailed = syncLog?.status === 'failed'
  const isPending = syncLog?.status === 'pending' || (isPastFirstAttempt && !isSuccess && !isFailed)

  let statusBadge = (
    <Chip
      size="small"
      icon={<ScheduleIcon sx={{ fontSize: '14px !important' }} />}
      label="Aguardando Horário do Jogo (+15m)"
      variant="outlined"
      sx={{ fontSize: '0.75rem', fontWeight: 600 }}
    />
  )

  if (isSuccess) {
    statusBadge = (
      <Chip
        size="small"
        icon={<CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} />}
        label="Resultado Obtido"
        color="success"
        sx={{ fontSize: '0.75rem', fontWeight: 700 }}
      />
    )
  } else if (isFailed) {
    statusBadge = (
      <Chip
        size="small"
        icon={<ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />}
        label="Falha após 6 tentativas"
        color="error"
        sx={{ fontSize: '0.75rem', fontWeight: 700 }}
      />
    )
  } else if (isPending) {
    statusBadge = (
      <Chip
        size="small"
        icon={<SyncIcon sx={{ fontSize: '14px !important' }} />}
        label="Buscando na Caixa"
        color="warning"
        sx={{ fontSize: '0.75rem', fontWeight: 700 }}
      />
    )
  }

  const attemptsCount = syncLog?.attemptsCount ?? 0
  const maxAttempts = syncLog?.maxAttempts ?? 6
  const successTimeFormatted = syncLog?.successAt
    ? dayjs(syncLog.successAt).format('DD/MM/YYYY [às] HH:mm:ss')
    : hasResult
      ? 'Registrado no bolão'
      : 'Ainda não obtido'

  return (
    <SyncContainer elevation={0}>
      <SyncHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SyncIcon fontSize="small" color={isSuccess ? 'success' : isFailed ? 'error' : 'action'} />
          <Typography variant="subtitle2" fontWeight={700}>
            Busca Automática do Resultado (Caixa)
          </Typography>
        </Box>
        {statusBadge}
      </SyncHeader>

      <InfoStatsGrid>
        <StatBox>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Quando conseguiu
          </Typography>
          <Typography variant="body2" fontWeight={700} color={isSuccess ? 'success.main' : 'text.primary'}>
            {successTimeFormatted}
          </Typography>
        </StatBox>

        <StatBox>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Tentativas realizadas
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {attemptsCount > 0 ? `${attemptsCount} de ${maxAttempts} tentativas` : 'Nenhuma tentativa ainda'}
          </Typography>
        </StatBox>

        <StatBox>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {isSuccess ? 'Última consulta' : syncLog?.nextAttemptAt ? 'Próxima tentativa' : '1ª tentativa programada'}
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {isSuccess && syncLog?.lastAttemptAt
              ? dayjs(syncLog.lastAttemptAt).format('HH:mm:ss')
              : syncLog?.nextAttemptAt
                ? dayjs(syncLog.nextAttemptAt).format('HH:mm:ss')
                : scheduledFirstAttempt
                  ? scheduledFirstAttempt.format('DD/MM HH:mm')
                  : '—'}
          </Typography>
        </StatBox>
      </InfoStatsGrid>

      {/* Histórico detalhado de horários das tentativas */}
      {syncLog?.attempts && syncLog.attempts.length > 0 && (
        <Box sx={{ mt: 0.5 }}>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => setShowHistory((prev) => !prev)}
            endIcon={showHistory ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              p: 0,
              color: 'text.secondary'
            }}
          >
            {showHistory
              ? 'Ocultar horários das tentativas'
              : `Ver horários e detalhes das ${syncLog.attempts.length} tentativa(s)`}
          </Button>

          {showHistory && (
            <AttemptsList>
              {syncLog.attempts.map((attempt) => (
                <AttemptItem key={`${attempt.attemptNumber}-${attempt.timestamp}`} isSuccess={attempt.success}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight={700}>
                      {attempt.attemptNumber}ª Tentativa • {dayjs(attempt.timestamp).format('DD/MM/YYYY [às] HH:mm:ss')}
                    </Typography>
                    <Chip
                      size="small"
                      label={attempt.success ? 'Sucesso' : 'Falhou'}
                      color={attempt.success ? 'success' : 'default'}
                      sx={{ height: 18, fontSize: '0.6875rem', fontWeight: 700 }}
                    />
                  </Box>

                  {attempt.message && (
                    <Typography variant="caption" color="text.secondary">
                      {attempt.message}
                    </Typography>
                  )}

                  {attempt.drawnNumbers && attempt.drawnNumbers.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {attempt.drawnNumbers.map((num) => (
                        <Box
                          key={num}
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6875rem',
                            fontWeight: 700
                          }}
                        >
                          {num < 10 ? `0${num}` : num}
                        </Box>
                      ))}
                    </Box>
                  )}
                </AttemptItem>
              ))}
            </AttemptsList>
          )}
        </Box>
      )}
    </SyncContainer>
  )
}

export default ResultSyncStatus
