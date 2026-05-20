import { Navigate } from 'react-router-dom'

import { CompleteProfileModal } from './components/completeProfileModal'
import { SweepstakesCarousel } from './components/sweepstakesCarousel'
import { JoinSweepstakeModal } from './components/joinSweepstakeModal'
import { UserProfile } from './components/userProfile'
import GridBackground from '@components/gridBackground'
import Header from '@components/header'
import { useHome } from './hook'
import { PageWrapper, ContentContainer, GridContainer } from './styles'

export const HomePage = () => {
  const { isProfileIncomplete, fetchSweepstakes, setSelectedId, sweepstakes, selectedId, user } = useHome()

  if (!user) return <Navigate to="/login" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <GridContainer>
            <UserProfile user={user} />
            <SweepstakesCarousel sweepstakes={sweepstakes} onJoin={setSelectedId} />
          </GridContainer>
        </ContentContainer>
        <CompleteProfileModal open={isProfileIncomplete} />
        <JoinSweepstakeModal open={!!selectedId} onClose={() => setSelectedId(null)} onSuccess={fetchSweepstakes} sweepstakeId={selectedId ?? ''} />
      </PageWrapper>
    </GridBackground>
  )
}

export default HomePage
