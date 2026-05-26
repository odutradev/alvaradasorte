import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const ListWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))
