import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

export const ProfileForm = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  marginTop: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(2)
}))

export const DescriptionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}))

export const WarningAlert = styled(Alert)({
  fontWeight: 600
})
