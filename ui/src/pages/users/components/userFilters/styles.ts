import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
  justifyContent: 'flex-end',
  maxWidth: 580,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch'
  }
}))

export const SearchWrapper = styled(Box)(() => ({
  flex: 1,
  minWidth: 200
}))

