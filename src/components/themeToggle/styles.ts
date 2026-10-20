import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

interface StyledToggleButtonProps {
  fullWidth?: boolean
}

export const ToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'fullWidth'
})<StyledToggleButtonProps>(({ theme, fullWidth }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  padding: theme.spacing(0.75),
  transition: 'all 0.2s ease',
  width: fullWidth ? '100%' : 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main
  }
}))