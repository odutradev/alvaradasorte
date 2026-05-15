import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const RootContainer = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundImage: 'none',
  boxShadow: 'none',
  overflow: 'hidden'
}))