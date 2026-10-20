import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const ProfileCard = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  height: '100%',
  minHeight: 0,
  overflowY: 'auto',
  gap: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  boxSizing: 'border-box',
  '&::-webkit-scrollbar': {
    width: 6
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3
  }
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

export const EditProfileButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: '100%',
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 500
}))

export const ProviderRow = styled(Box)(({ theme }) => ({
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