import { useEffect, useState, useCallback } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import RefreshIcon from '@mui/icons-material/Refresh'
import CasinoIcon from '@mui/icons-material/Casino'
import EditNoteIcon from '@mui/icons-material/EditNote'
import dayjs from 'dayjs'

import Modal from '@components/modal'
import { getLotteries } from '@services/lotteries'
import { formatCurrency } from '@utils/string'
import { ModalGrid, LotteryCard } from './styles'

import type { LotterySelectModalProps } from './types'
import type { LotteryItemResponse } from '@services/lotteries/types'

const LotterySelectModal = ({ open, onClose, onSelect, onManual }: LotterySelectModalProps) => {
  const [lotteries, setLotteries] = useState<LotteryItemResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadLotteries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLotteries()
      setLotteries(data)
    } catch {
      setError('Não foi possível carregar as informações da Caixa Econômica. Tente novamente ou crie manualmente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open && lotteries.length === 0) {
      loadLotteries()
    }
  }, [open, lotteries.length, loadLotteries])

  const formatDrawDate = (dateStr: string | null) => {
    if (!dateStr) return 'A definir'
    return dayjs(dateStr).format('DD/MM/YYYY [às] HH:mm')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="md"
      title="Selecionar Loteria da Caixa"
      subtitle="Escolha a modalidade de sorteio para carregar automaticamente as informações do próximo concurso"
      actions={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={loadLotteries}
              disabled={loading}
              color="inherit"
            >
              Atualizar
            </Button>
            {onManual && (
              <Button
                size="small"
                startIcon={<EditNoteIcon />}
                onClick={() => {
                  onManual()
                  onClose()
                }}
                color="inherit"
              >
                Criar sem dados da Caixa
              </Button>
            )}
          </Box>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
        </Box>
      }
    >
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <ModalGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </ModalGrid>
      )}

      {!loading && (
        <ModalGrid>
          {lotteries.map((lottery) => {
            const hasPrize = lottery.estimatedPrize > 0
            const displayPrize = hasPrize
              ? formatCurrency(lottery.estimatedPrize)
              : lottery.accumulatedPrize > 0
                ? formatCurrency(lottery.accumulatedPrize)
                : 'A definir'

            return (
              <LotteryCard
                key={lottery.type}
                accentColor={lottery.color}
                onClick={() => {
                  onSelect(lottery)
                  onClose()
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CasinoIcon sx={{ color: lottery.color, fontSize: 22 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {lottery.name}
                    </Typography>
                  </Box>
                  {lottery.isAccumulated && (
                    <Chip
                      label="Acumulou!"
                      size="small"
                      color="warning"
                      sx={{ fontWeight: 700, height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Próximo Concurso nº <strong>{lottery.nextContestNumber || '—'}</strong>
                </Typography>

                <Box sx={{ my: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Prêmio Estimado
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: lottery.color }}>
                    {displayPrize}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
                  Sorteio: <strong>{formatDrawDate(lottery.drawDate)}</strong>
                </Typography>
              </LotteryCard>
            )
          })}
        </ModalGrid>
      )}
    </Modal>
  )
}

export default LotterySelectModal
