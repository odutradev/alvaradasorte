import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

export const EmptyCard = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
  height: '100%',
  minHeight: 0,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  boxSizing: 'border-box'
}))