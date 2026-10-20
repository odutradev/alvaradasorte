import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import ParticipantsTable from './components/participantsTable'
import PageContainer from '@components/pageContainer'
import useSweepstakeDetails from './hooks'
import DetailsCard from './components/detailsCard'
import { GridContainer } from './styles'

const SweepstakeDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { details, preset, presets, fetchDetails, isLoading } = useSweepstakeDetails(id)

  return (
    <PageContainer fullHeight>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 200 }}>
          <CircularProgress size={32} />
        </Box>
      )}
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
    </PageContainer>
  )
}

export default SweepstakeDetailsPage