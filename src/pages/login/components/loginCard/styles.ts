import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

export const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  flexDirection: 'column',
  maxWidth: 480,
  width: '100%',
  display: 'flex'
}))
