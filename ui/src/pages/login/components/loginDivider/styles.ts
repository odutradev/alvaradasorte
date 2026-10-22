import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const DividerContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  '&::before, &::after': {
    backgroundColor: theme.palette.divider,
    content: '""',
    height: 1,
    flex: 1
  },
  '& > *': {
    padding: theme.spacing(0, 2)
  }
}))
