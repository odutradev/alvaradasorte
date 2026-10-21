import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

export const ModalGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: theme.spacing(2),
  width: '100%',
  padding: theme.spacing(1, 0)
}))

export const LotteryCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'accentColor'
})<{ accentColor?: string }>(({ theme, accentColor }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1.5px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    borderColor: accentColor || theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${accentColor ? `${accentColor}25` : theme.palette.action.hover}`
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: accentColor || theme.palette.primary.main
  }
}))
