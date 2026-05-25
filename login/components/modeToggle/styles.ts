import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const ToggleButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600
}))
