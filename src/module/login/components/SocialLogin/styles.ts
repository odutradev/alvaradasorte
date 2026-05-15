import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export const SocialContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const SocialButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.divider
  }
}))