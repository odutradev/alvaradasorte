import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

export const ToggleButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  height: 48,
  width: 48,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.05)'
  }
}))