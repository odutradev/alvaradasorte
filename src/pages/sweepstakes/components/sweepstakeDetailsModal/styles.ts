import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const ListContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  display: 'flex',
  marginTop: theme.spacing(2)
}))

export const ProgressWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0)
}))

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(2)
}))

export const ParticipationCard = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  display: 'flex'
}))