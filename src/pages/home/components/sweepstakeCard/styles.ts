import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  height: '100%',
  width: '100%',
  flex: 1,
  minHeight: 0,
  gap: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  boxSizing: 'border-box',
  overflowY: 'auto',
  animation: 'cardSlideFadeIn 0.2s ease-out backwards',
  '@keyframes cardSlideFadeIn': {
    from: {
      opacity: 0.85,
      transform: 'translateY(4px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  '&::-webkit-scrollbar': {
    width: 6
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3
  }
}))

export const CardBody = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const HeaderRow = styled(Box)({
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  textAlign: 'center'
})

export const PrizeCardsContainer = styled(Box)(({ theme }) => ({
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1.5),
  display: 'grid',
  width: '100%'
}))

export const PrizeCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPrimary'
})<{ isPrimary?: boolean }>(({ theme, isPrimary }) => ({
  backgroundColor: isPrimary
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.12)
    : theme.palette.action.hover,
  border: `1px solid ${isPrimary ? alpha(theme.palette.primary.main, 0.3) : theme.palette.divider}`,
  padding: theme.spacing(1.2, 1.5),
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.25),
  borderRadius: 12,
  display: 'flex',
  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: isPrimary ? alpha(theme.palette.primary.main, 0.6) : alpha(theme.palette.text.primary, 0.25),
    boxShadow: `0 4px 12px ${alpha(isPrimary ? theme.palette.primary.main : '#000', 0.08)}`
  }
}))

export const ActionButtonsRow = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  marginTop: theme.spacing(2),
  gap: theme.spacing(1.5)
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.2, 2)
}))

export const EditButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.2, 2),
  flexShrink: 0
}))



