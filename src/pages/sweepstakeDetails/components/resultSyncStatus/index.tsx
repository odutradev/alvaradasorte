import { useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SyncIcon from '@mui/icons-material/Sync'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { CompactSyncContainer, SyncRow } from './styles'

import type { SweepstakeResponse } from '@services/sweepstakes/types'

interface ResultSyncStatusProps {
  sweepstake: SweepstakeResponse
}

export const ResultSyncStatus = ({ sweepstake }: ResultSyncStatusProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const syncLog = sweepstake.resultSyncLog
  const hasResult = Boolean(sweepstake.result && sweepstake.result.length > 0)

  if (!sweepstake.lotteryType) {
    return null
  }

  const drawTime = dayjs(sweepstake.drawDate)
  const scheduledFirstAttempt = drawTime.isValid() ? drawTime.add(15, 'minute') : null
  const isPastFirstAttempt = scheduledFirstAttempt ? dayjs().isAfter(scheduledFirstAttempt) : false

  const isSuccess = syncLog?.status === 'success' || hasResult
  const isFailed = syncLog?.status === 'failed'
  const isPending = syncLog?.status === 'pending' || (isPastFirstAttempt && !isSuccess && !isFailed)

  let statusLabel = 'Aguardando jogo'
  let statusColor: 'default' | 'success' | 'warning' | 'error' = 'default'
  let iconColor: 'action' | 'success' | 'warning' | 'error' = 'action'
  let StatusIcon = ScheduleIcon

  if (isSuccess) {
    statusLabel = 'Obtido'
    statusColor = 'success'
    iconColor = 'success'
    StatusIcon = CheckCircleOutlineIcon
  } else if (isFailed) {
    statusLabel = 'Falhou (6/6)'
    statusColor = 'error'
    iconColor = 'error'
    StatusIcon = ErrorOutlineIcon
  } else if (isPending) {
    statusLabel = `Buscando (${syncLog?.attemptsCount || 0}/6)`
    statusColor = 'warning'
    iconColor = 'warning'
    StatusIcon = SyncIcon
  }

  let summaryText = ''
  if (isSuccess) {
    if (syncLog?.successAt) {
      summaryText = `Sincronizado ${dayjs(syncLog.successAt).format('DD/MM [às] HH:mm')}`
    } else {
      summaryText = 'Resultado cadastrado'
    }
  } else if (isFailed) {
    summaryText = '6 tentativas esgotadas sem sucesso'
  } else if (isPending) {
    summaryText = syncLog?.nextAttemptAt
      ? `Próxima tentativa às ${dayjs(syncLog.nextAttemptAt).format('HH:mm')}`
      : 'Tentativa em andamento...'
  } else if (scheduledFirstAttempt) {
    summaryText = `1ª tentativa: ${scheduledFirstAttempt.format('DD/MM HH:mm')}`
  }

  const hasHistory = Boolean(syncLog?.attempts && syncLog.attempts.length > 0)

  return (
    <>
      <CompactSyncContainer elevation={0}>
        <SyncRow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, flex: 1 }}>
            <StatusIcon color={iconColor} sx={{ fontSize: 16, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography variant="caption" fontWeight={700} noWrap display="block">
                Apuração Caixa
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ fontSize: '0.6875rem' }}>
                {summaryText}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <Chip
              size="small"
              label={statusLabel}
              color={statusColor}
              variant={statusColor === 'default' ? 'outlined' : 'filled'}
              sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700 }}
            />
            {hasHistory && (
              <Tooltip title="Ver histórico de tentativas e horários">
                <IconButton size="small" onClick={() => setIsDialogOpen(true)} sx={{ p: 0.25 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </SyncRow>
      </CompactSyncContainer>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, fontSize: '1rem', fontWeight: 700 }}>
          Histórico da Apuração Automática
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: '8px !important' }}>
          <Typography variant="caption" color="text.secondary">
            Tentativas realizadas ({syncLog?.attemptsCount || 0} de {syncLog?.maxAttempts || 6}):
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
            {syncLog?.attempts.map((attempt) => (
              <Box
                key={`${attempt.attemptNumber}-${attempt.timestamp}`}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: attempt.success ? 'rgba(46, 125, 50, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '3px solid',
                  borderLeftColor: attempt.success ? 'success.main' : 'warning.main'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" fontWeight={700}>
                    {attempt.attemptNumber}ª Tentativa
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(attempt.timestamp).format('DD/MM/YYYY [às] HH:mm:ss')}
                  </Typography>
                </Box>
                {attempt.message && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {attempt.message}
                  </Typography>
                )}
                {attempt.drawnNumbers && attempt.drawnNumbers.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {attempt.drawnNumbers.map((num) => (
                      <Box
                        key={num}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          fontWeight: 700
                        }}
                      >
                        {num < 10 ? `0${num}` : num}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ResultSyncStatus
