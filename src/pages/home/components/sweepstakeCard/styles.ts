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

export const GamesFlowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  width: '100%',
  alignItems: 'center',
  marginTop: theme.spacing(0.5)
}))

export const GameChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasHits'
})<{ hasHits?: boolean }>(({ theme, hasHits }) => {
  const isDark = theme.palette.mode === 'dark'
  if (hasHits) {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(0.75),
      padding: theme.spacing(0.5, 1.25),
      borderRadius: 20,
      backgroundColor: isDark ? alpha('#16a34a', 0.15) : alpha('#16a34a', 0.08),
      border: '1.5px solid #22c55e',
      boxShadow: '0 0 10px rgba(34, 197, 94, 0.25)',
      transition: 'border-color 0.15s ease, transform 0.15s ease',
      '&:hover': {
        borderColor: '#4ade80',
        transform: 'translateY(-1px)'
      }
    }
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.5, 1.25),
    borderRadius: 20,
    backgroundColor: isDark ? '#1f222e' : '#f1f5f9',
    border: `1px solid ${isDark ? '#373b50' : '#cbd5e1'}`,
    transition: 'border-color 0.15s ease, transform 0.15s ease',
    '&:hover': {
      borderColor: isDark ? theme.palette.primary.light : theme.palette.primary.main,
      transform: 'translateY(-1px)'
    }
  }
})

export const ChipNumber = styled('span', {
  shouldForwardProp: (prop) => prop !== 'matched'
})<{ matched?: boolean }>(({ theme, matched }) => {
  const isDark = theme.palette.mode === 'dark'
  if (matched) {
    return {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      borderRadius: '50%',
      width: 22,
      height: 22,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.75rem',
      lineHeight: 1,
      boxShadow: '0 0 8px rgba(34, 197, 94, 0.7)',
      border: '1.5px solid #4ade80'
    }
  }

  return {
    color: isDark ? '#f8fafc' : '#0f172a',
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 1.2,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18
  }
})



