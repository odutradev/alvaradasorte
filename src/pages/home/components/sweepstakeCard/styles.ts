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

export const MinimalGamesContainer = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
    padding: theme.spacing(1, 1.25),
    borderRadius: 10,
    backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.35) : alpha('#000', 0.02),
    border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.5) : alpha(theme.palette.divider, 0.8)}`
  }
})

export const MinimalGameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  flexWrap: 'wrap'
}))

export const MinimalNumberBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'matched'
})<{ matched?: boolean }>(({ theme, matched }) => {
  const isDark = theme.palette.mode === 'dark'
  if (matched) {
    return {
      width: 22,
      height: 22,
      borderRadius: '50%',
      backgroundColor: '#16a34a',
      color: '#ffffff',
      border: '1px solid #4ade80',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.6875rem',
      boxShadow: '0 0 6px rgba(74, 222, 128, 0.4)'
    }
  }

  return {
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: isDark ? '#232635' : '#f1f5f9',
    color: isDark ? '#f8fafc' : '#1e293b',
    border: `1px solid ${isDark ? '#363a4d' : '#cbd5e1'}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.6875rem'
  }
})



