import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { SweepstakeDetailsModal } from './components/sweepstakeDetailsModal'
import { SweepstakeFormModal } from './components/sweepstakeFormModal'
import GridBackground from '@components/gridBackground'
import { Header } from '@pages/home/components/header'

import { useSweepstakesAdmin } from './hook'
import * as S from './styles'

export const SweepstakesAdminPage = () => {
  const { loadSweepstakes, setDetailsId, setModalOpen, sweepstakes, detailsId, modalOpen, logout, user } = useSweepstakesAdmin()

  if (!user) return null

  return (
    <GridBackground>
      <S.PageWrapper>
        <Header onLogout={logout} userRole={user.role} />
        <S.ContentContainer>
          <S.HeaderSection>
            <Typography variant="h4" fontWeight={700} color="primary">
              Gerenciamento de Bolões
            </Typography>
            <Button variant="contained" size="large" onClick={() => setModalOpen(true)}>
              Novo Bolão
            </Button>
          </S.HeaderSection>
          <S.ListContainer>
            {sweepstakes.map((swp) => (
              <Paper key={swp.id} elevation={2} sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {swp.title}
                  </Typography>
                  <S.InfoGrid>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cotas Disponíveis:</strong> {swp.availableQuotas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Valor do Prêmio:</strong> R$ {swp.prizeValue.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Sorteio:</strong> {dayjs(swp.drawDate).format('DD/MM/YYYY')}
                    </Typography>
                  </S.InfoGrid>
                </Box>
                <IconButton color="primary" onClick={() => setDetailsId(swp.id)} size="large" sx={{ ml: 2 }}>
                  <VisibilityIcon />
                </IconButton>
              </Paper>
            ))}
            {sweepstakes.length === 0 && (
              <S.EmptyStateWrapper elevation={1}>
                <Typography variant="body1" color="text.secondary" align="center">
                  Nenhum bolão cadastrado no sistema.
                </Typography>
              </S.EmptyStateWrapper>
            )}
          </S.ListContainer>
        </S.ContentContainer>
        <SweepstakeFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadSweepstakes} />
        {!!detailsId && <SweepstakeDetailsModal sweepstakeId={detailsId} open={true} onClose={() => setDetailsId(null)} />}
      </S.PageWrapper>
    </GridBackground>
  )
}