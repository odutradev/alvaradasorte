import { useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'

import useSweepstakeDetails from './hooks'
import { PageWrapper, ContentContainer, GridContainer } from './styles'
import ParticipantsTable from './components/participantsTable'
import GridBackground from '@components/gridBackground'
import DetailsCard from './components/detailsCard'
import Subheader from '@components/subheader'
import Header from '@components/header'

const SweepstakeDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { details, preset, fetchDetails, isLoading } = useSweepstakeDetails(id)

  const handleGoBack = () => {
    navigate('/sweepstakes')
  }

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <Subheader title="Detalhes do Bolão" buttonLabel="Voltar" onButtonClick={handleGoBack} />
          {isLoading && <Typography variant="body1">Carregando...</Typography>}
          {!isLoading && details && (
            <GridContainer>
              <DetailsCard data={details} preset={preset} onUpdate={fetchDetails} />
              <ParticipantsTable participations={details.participations} />
            </GridContainer>
          )}
        </ContentContainer>
      </PageWrapper>
    </GridBackground>
  )
}

export default SweepstakeDetailsPage