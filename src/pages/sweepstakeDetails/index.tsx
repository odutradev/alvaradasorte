import { useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'

import { PageWrapper, ContentContainer, GridContainer } from './styles'
import ParticipantsTable from './components/participantsTable'
import GridBackground from '@components/gridBackground'
import useSweepstakeDetails from './hooks'
import DetailsCard from './components/detailsCard'
import Subheader from '@components/subheader'
import Header from '@components/header'

const SweepstakeDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { details, preset, presets, fetchDetails, isLoading } = useSweepstakeDetails(id)

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
              <DetailsCard
                data={details}
                preset={preset}
                presets={presets}
                onUpdate={fetchDetails}
              />
              <ParticipantsTable
                participations={details.participations}
                sweepstakeId={details.id}
                onUpdate={fetchDetails}
              />
            </GridContainer>
          )}
        </ContentContainer>
      </PageWrapper>
    </GridBackground>
  )
}

export default SweepstakeDetailsPage