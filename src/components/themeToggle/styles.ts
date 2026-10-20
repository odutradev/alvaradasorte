import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

export const ToggleButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  padding: theme.spacing(0.75),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main
  }
}))