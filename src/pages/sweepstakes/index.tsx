import SweepstakeFormModal from './components/sweepstakeFormModal'
import { PageWrapper, ContentContainer } from './styles'
import SweepstakeList from './components/sweepstakeList'
import GridBackground from '@components/gridBackground'
import useSweepstakesAdmin from './hook'
import Subheader from '@components/subheader'
import Header from '@components/header'

const Sweepstakes = () => {
  const { loadSweepstakes, setModalOpen, viewDetails, sweepstakes, modalOpen, user } = useSweepstakesAdmin()

  if (!user) return null

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <Subheader
            title="Gerenciamento de Bolões"
            buttonLabel="Novo Bolão"
            onButtonClick={() => setModalOpen(true)}
          />
          <SweepstakeList sweepstakes={sweepstakes} onViewDetails={viewDetails} />
        </ContentContainer>
        <SweepstakeFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadSweepstakes} />
      </PageWrapper>
    </GridBackground>
  )
}

export default Sweepstakes
