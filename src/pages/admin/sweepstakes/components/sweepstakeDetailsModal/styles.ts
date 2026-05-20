import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const ListContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  display: 'flex',
  marginTop: theme.spacing(2)
}))