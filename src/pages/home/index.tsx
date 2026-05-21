import { Navigate } from 'react-router-dom'

import { CompleteProfileModal } from './components/completeProfileModal'
import { SweepstakesCarousel } from './components/sweepstakesCarousel'
import { PageWrapper, ContentContainer, GridContainer } from './styles'
import { JoinSweepstakeModal } from './components/joinSweepstakeModal'
import GridBackground from '@components/gridBackground'
import { UserProfile } from './components/userProfile'
import Header from '@components/header'
import { useHome } from './hook'

export const HomePage = () => {
  const {
    setIsProfileModalOpen,
    isProfileModalOpen,
    isProfileIncomplete,
    fetchSweepstakes,
    setSelectedId,
    sweepstakes,
    selectedId,
    user
  } = useHome()

  if (!user) return <Navigate to="/login" replace />

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <GridContainer>
            <UserProfile
              user={user}
              isProfileIncomplete={isProfileIncomplete}
              onEditProfile={() => setIsProfileModalOpen(true)}
            />
            <SweepstakesCarousel sweepstakes={sweepstakes} onJoin={setSelectedId} />
          </GridContainer>
        </ContentContainer>
        <CompleteProfileModal
          open={isProfileIncomplete || isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          isProfileIncomplete={isProfileIncomplete}
        />
        <JoinSweepstakeModal
          open={!!selectedId}
          onClose={() => setSelectedId(null)}
          onSuccess={fetchSweepstakes}
          sweepstake={sweepstakes.find((s) => s.id === selectedId) ?? null}
        />
      </PageWrapper>
    </GridBackground>
  )
}

export default HomePage