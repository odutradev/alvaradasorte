import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)({
  flexDirection: 'column',
  minHeight: '100vh',
  display: 'flex',
  width: '100%'
})

export const ContentContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(2, 4, 8),
  margin: '0 auto',
  maxWidth: 1200,
  display: 'flex',
  width: '100%',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))
