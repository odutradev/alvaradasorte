import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const TableContainerWrapper = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2)
}))

export const EmptyBox = styled(Box)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  display: 'flex'
}))