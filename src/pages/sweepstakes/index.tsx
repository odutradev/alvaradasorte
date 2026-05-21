import { PageWrapper, ContentContainer, ListContainer } from './styles'
import { SweepstakeFormModal } from './components/sweepstakeFormModal'
import SweepstakeCard from './components/sweepstakeCard'
import GridBackground from '@components/gridBackground'
import EmptyState from '@components/emptyState'
import { useSweepstakesAdmin } from './hook'
import Subheader from '@components/subheader'
import Header from '@components/header'

export const SweepstakesPage = () => {
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
          <ListContainer>
            {sweepstakes.map((swp) => (
              <SweepstakeCard key={swp.id} sweepstake={swp} onViewDetails={viewDetails} />
            ))}
            {sweepstakes.length === 0 && (
              <EmptyState description="Nenhum bolão cadastrado no sistema." />
            )}
          </ListContainer>
        </ContentContainer>
        <SweepstakeFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadSweepstakes} />
      </PageWrapper>
    </GridBackground>
  )
}