import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '100vh',
  display: 'flex',
  width: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    maxHeight: 'none',
    minHeight: '100vh',
    overflow: 'visible'
  }
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(2, 3, 2.5),
  display: 'flex',
  width: '100%',
  flex: 1,
  minHeight: 0,
  gap: theme.spacing(2.5),
  boxSizing: 'border-box',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    minHeight: 'auto',
    flex: 'none'
  }
}))

export const GridContainer = styled(Box)(({ theme }) => ({
  gridTemplateColumns: '380px minmax(0, 1fr)',
  display: 'grid',
  width: '100%',
  flex: 1,
  minHeight: 0,
  gap: theme.spacing(3),
  alignItems: 'stretch',
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '340px minmax(0, 1fr)',
    gap: theme.spacing(2)
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    minHeight: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }
}))