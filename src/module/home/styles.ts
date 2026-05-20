import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  flexDirection: 'column',
  minHeight: '100vh',
  display: 'flex'
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  justifyContent: 'center',
  alignItems: 'flex-start',
  display: 'flex',
  flex: 1
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