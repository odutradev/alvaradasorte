import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
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