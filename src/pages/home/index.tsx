import { Navigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { CompleteProfileModal } from './components/completeProfileModal'
import { JoinSweepstakeModal } from './components/joinSweepstakeModal'
import { SweepstakeCard } from './components/sweepstakeCard'
import { UserProfile } from './components/userProfile'
import GridBackground from '@components/gridBackground'
import Header from '@components/header'
import { useHome } from './hook'
import { PageWrapper, ContentContainer, GridContainer, CardsWrapper, EmptyStateWrapper } from './styles'

export const HomePage = () => {
  const { isProfileIncomplete, fetchSweepstakes, setSelectedId, sweepstakes, selectedId, user } = useHome()

  if (!user) return <Navigate to="/login" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <GridContainer>
            <Box>
              <UserProfile user={user} />
            </Box>
            <CardsWrapper>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Bolões Disponíveis
              </Typography>
              {sweepstakes.map((swp) => (
                <SweepstakeCard key={swp.id} data={swp} onJoin={setSelectedId} />
              ))}
              {sweepstakes.length === 0 && (
                <EmptyStateWrapper elevation={1}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Nenhum bolão aberto no momento. Fique de olho!
                  </Typography>
                </EmptyStateWrapper>
              )}
            </CardsWrapper>
          </GridContainer>
        </ContentContainer>
        <CompleteProfileModal open={isProfileIncomplete} />
        <JoinSweepstakeModal open={!!selectedId} onClose={() => setSelectedId(null)} onSuccess={fetchSweepstakes} sweepstakeId={selectedId ?? ''} />
      </PageWrapper>
    </GridBackground>
  )
}

export default HomePage