import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

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