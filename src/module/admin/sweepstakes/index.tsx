import { useEffect, useState, useCallback } from 'react'
import Typography from '@mui/material/Typography'
import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { SweepstakeDetailsModal } from './components/SweepstakeDetailsModal'
import { SweepstakeFormModal } from './components/SweepstakeFormModal'
import { getSweepstakes } from '@core/services/sweepstakes'
import { Header } from '../../home/components/Header'
import useAction from '@core/hooks/useAction'
import { useAuth } from '@core/hooks/useAuth'
import * as S from './styles'

import type { SweepstakeResponse } from '@core/services/sweepstakes/types'

export const SweepstakesAdminPage = () => {
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { logout, user } = useAuth()

  const loadSweepstakes = useCallback(async () => {
    await useAction({
      action: async () => await getSweepstakes(),
      callback: (data) => setSweepstakes(data),
      silent: true
    })
  }, [])

  useEffect(() => {
    loadSweepstakes()
  }, [loadSweepstakes])

  if (!user) return null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onLogout={logout} userRole={user.role} />
      <S.PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight={700}>Gerenciar Bolões</Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>Novo Bolão</Button>
        </Box>
        <S.ListContainer>
          {sweepstakes.map((swp) => (
            <Paper key={swp.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{swp.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cotas: {swp.availableQuotas} | Prêmio: R$ {swp.prizeValue}
                </Typography>
              </Box>
              <IconButton color="primary" onClick={() => setDetailsId(swp.id)}>
                <VisibilityIcon />
              </IconButton>
            </Paper>
          ))}
        </S.ListContainer>
      </S.PageContainer>
      <SweepstakeFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadSweepstakes} />
      {!!detailsId && (
        <SweepstakeDetailsModal sweepstakeId={detailsId} open={true} onClose={() => setDetailsId(null)} />
      )}
    </Box>
  )
}