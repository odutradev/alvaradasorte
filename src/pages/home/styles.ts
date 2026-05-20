import { styled } from '@mui/material/styles'
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
  alignItems: 'center',
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
