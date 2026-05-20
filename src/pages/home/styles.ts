import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)({
  flexDirection: 'column',
  minHeight: '100vh',
  display: 'flex',
  width: '100%'
})

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4, 8),
  justifyContent: 'center',
  alignItems: 'flex-start',
  display: 'flex',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))

export const GridContainer = styled(Box)(({ theme }) => ({
  gridTemplateColumns: 'minmax(300px, 400px) 1fr',
  maxWidth: 1200,
  width: '100%',
  display: 'grid',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr'
  }
}))

export const CardsWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(3)
}))

export const EmptyStateWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.divider}`,
  padding: theme.spacing(6, 4),
  borderRadius: theme.shape.borderRadius * 2,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex'
}))