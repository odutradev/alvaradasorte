import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const Container = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2)
  }
}))