import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
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

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    lineHeight: 1.3
  }
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}))
