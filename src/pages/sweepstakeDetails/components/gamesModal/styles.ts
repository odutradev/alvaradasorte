import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const ModalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}))

export const BudgetSummaryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.spacing(1.5)
}))

type ToneType = 'default' | 'success' | 'warning' | 'error'

export const BudgetCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'tone'
})<{ tone?: ToneType }>(({ theme, tone }: { theme: any; tone?: ToneType }) => {
  const selectedTone: ToneType = tone ?? 'default'
  const tones: Record<ToneType, { bg: string; border: string; text: string }> = {
    default: {
      bg: alpha(theme.palette.primary.main, 0.08),
      border: alpha(theme.palette.primary.main, 0.2),
      text: theme.palette.primary.main
    },
    success: {
      bg: alpha(theme.palette.success.main, 0.1),
      border: alpha(theme.palette.success.main, 0.25),
      text: theme.palette.success.main
    },
    warning: {
      bg: alpha(theme.palette.warning.main, 0.1),
      border: alpha(theme.palette.warning.main, 0.25),
      text: theme.palette.warning.main
    },
    error: {
      bg: alpha(theme.palette.error.main, 0.1),
      border: alpha(theme.palette.error.main, 0.25),
      text: theme.palette.error.main
    }
  }

  const current = tones[selectedTone]

  return {
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: current.bg,
    border: `1px solid ${current.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  }
})

export const SuggestionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}))

export const NumberGrid = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))',
    gap: theme.spacing(0.75),
    padding: theme.spacing(1.5),
    backgroundColor: isDark ? '#14161f' : '#f8fafc',
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${isDark ? '#2e3244' : '#e2e8f0'}`,
    maxHeight: 280,
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
})

export const GamesListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxHeight: 380,
  overflowY: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
}))

export const NumberBall = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'badgeColor'
})<{ selected?: boolean; badgeColor?: string }>(({ theme, selected, badgeColor }) => {
  const isDark = theme.palette.mode === 'dark'
  const highlightColor = badgeColor || theme.palette.primary.main

  if (selected) {
    return {
      minWidth: 38,
      width: 38,
      height: 38,
      padding: 0,
      borderRadius: '50%',
      fontWeight: 800,
      fontSize: '0.875rem',
      backgroundColor: highlightColor,
      color: '#ffffff',
      border: '2px solid #ffffff',
      boxShadow: `0 2px 10px ${alpha(highlightColor, 0.7)}`,
      transition: 'all 0.15s ease-in-out',
      '&:hover': {
        backgroundColor: highlightColor,
        filter: 'brightness(1.25)',
        transform: 'scale(1.15)',
        boxShadow: `0 4px 14px ${alpha(highlightColor, 0.9)}`,
        zIndex: 2
      }
    }
  }

  return {
    minWidth: 38,
    width: 38,
    height: 38,
    padding: 0,
    borderRadius: '50%',
    fontWeight: 700,
    fontSize: '0.85rem',
    backgroundColor: isDark ? '#1f222e' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1.5px solid ${isDark ? '#373b50' : '#cbd5e1'}`,
    boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 2px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.15s ease-in-out',
    '&:hover': {
      backgroundColor: isDark ? alpha(highlightColor, 0.3) : alpha(highlightColor, 0.15),
      border: `2px solid ${highlightColor}`,
      color: isDark ? '#ffffff' : highlightColor,
      transform: 'scale(1.15)',
      boxShadow: `0 4px 12px ${alpha(highlightColor, 0.45)}`,
      zIndex: 2
    }
  }
})

export const GamesSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}))

export const GameRow = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    backgroundColor: isDark ? '#1b1d26' : '#ffffff',
    border: `1px solid ${isDark ? '#2f3447' : '#e2e8f0'}`,
    borderRadius: theme.shape.borderRadius * 1.5,
    padding: theme.spacing(1.25, 1.75),
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: isDark ? '#232633' : '#f8fafc',
      borderColor: alpha(theme.palette.primary.main, 0.5),
      boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.05)'
    }
  }
})

export const NumbersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  flex: 1
}))

export const NumberChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'matched'
})<{ matched: boolean }>(({ theme, matched }) => {
  const isDark = theme.palette.mode === 'dark'

  if (matched) {
    return {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      border: '1.5px solid #4ade80',
      borderRadius: '50%',
      width: 32,
      height: 32,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.8125rem',
      boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
    }
  }

  return {
    backgroundColor: isDark ? '#2b2f40' : '#f1f5f9',
    color: isDark ? '#f8fafc' : '#0f172a',
    border: `1px solid ${isDark ? '#434963' : '#cbd5e1'}`,
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8125rem',
    boxShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
  }
})

export const SectionDivider = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  height: '1px',
  width: '100%'
}))

export const ResultSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}))