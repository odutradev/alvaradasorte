import { Navigate } from 'react-router-dom'

import CompleteProfileModal from './components/completeProfileModal'
import SweepstakesCarousel from './components/sweepstakesCarousel'
import JoinSweepstakeModal from './components/joinSweepstakeModal'
import PageContainer from '@components/pageContainer'
import UserProfile from './components/userProfile'
import { GridContainer } from './styles'
import useHome from './hook'

const Home = () => {
  const { setIsProfileModalOpen, isProfileModalOpen, isProfileIncomplete, fetchSweepstakes, setSelectedId, sweepstakes, selectedId, user } = useHome()

  if (!user) return <Navigate to="/login" replace />

  const selectedSweepstake = sweepstakes.find((s) => s.id === selectedId)

  return (
    <PageContainer contentSx={{ alignItems: 'center', justifyContent: 'center' }}>
      <GridContainer>
        <UserProfile
          user={user}
          sweepstakes={sweepstakes}
          isProfileIncomplete={isProfileIncomplete}
          onEditProfile={() => setIsProfileModalOpen(true)}
        />
        <SweepstakesCarousel sweepstakes={sweepstakes} onJoin={setSelectedId} />
      </GridContainer>
      <CompleteProfileModal
        open={isProfileIncomplete || isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        isProfileIncomplete={isProfileIncomplete}
      />
      <JoinSweepstakeModal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        onSuccess={fetchSweepstakes}
        sweepstakeId={selectedId ?? ''}
        sweepstake={selectedSweepstake}
      />
    </PageContainer>
  )
}

export default Home
