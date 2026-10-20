import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch'
  }
}))

export const SearchWrapper = styled(Box)(() => ({
  flex: 1
}))

