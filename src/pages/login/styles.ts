import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const PageWrapper = styled(Box)({
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  padding: '16px'
})

export const ThemeToggleWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  top: theme.spacing(3)
}))

export const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  flexDirection: 'column',
  maxWidth: 480,
  width: '100%',
  display: 'flex'
}))

export const DividerWrapper = styled(Box)(({ theme }) => ({
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