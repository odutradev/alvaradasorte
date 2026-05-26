import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const SectionContainer = styled(Box)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.error.dark}`,
  backgroundColor: `${theme.palette.error.dark}14`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2)
}))

export const SectionHeader = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const ListContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  paddingTop: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(0.5)
}))

export const ListItem = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  alignItems: 'center',
  display: 'flex'
}))