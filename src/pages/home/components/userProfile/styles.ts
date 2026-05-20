import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const ProfileCard = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(4),
  alignItems: 'center',
  maxWidth: 600,
  display: 'flex',
  width: '100%',
  gap: theme.spacing(2)
}))

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: theme.spacing(12),
  width: theme.spacing(12),
  fontSize: '2.5rem'
}))

export const InfoRow = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0),
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  display: 'flex',
  '&:last-child': {
    borderBottom: 'none'
  }
}))

export const InfoContainer = styled(Box)({
  flexDirection: 'column',
  display: 'flex',
  width: '100%'
})

export const ValueText = styled(Typography)({
  wordBreak: 'break-word',
  textAlign: 'right'
})

export const ProviderRow = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  justifyContent: 'center',
  paddingTop: theme.spacing(1.5),
  alignItems: 'center',
  display: 'flex',
  width: '100%'
}))

export const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.75),
  alignItems: 'center',
  display: 'flex',
  cursor: 'default',
  margin: `0 ${theme.spacing(0.75)}`
}))

export const IncompleteAlert = styled(Alert)({
  width: '100%'
})
