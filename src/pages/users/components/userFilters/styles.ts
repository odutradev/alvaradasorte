import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const FiltersContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch'
  }
}))

export const SearchWrapper = styled(Box)(() => ({
  flex: 1
}))
