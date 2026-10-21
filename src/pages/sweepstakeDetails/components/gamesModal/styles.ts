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

export const NumberGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
  gap: theme.spacing(0.75),
  padding: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  maxHeight: 220,
  overflowY: 'auto'
}))

export const NumberBall = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'badgeColor'
})<{ selected?: boolean; badgeColor?: string }>(({ theme, selected, badgeColor }) => ({
  minWidth: 36,
  height: 36,
  padding: 0,
  borderRadius: '50%',
  fontWeight: 700,
  fontSize: '0.85rem',
  backgroundColor: selected
    ? (badgeColor || theme.palette.primary.main)
    : alpha(theme.palette.action.hover, 0.5),
  color: selected
    ? '#ffffff'
    : theme.palette.text.primary,
  border: `1px solid ${selected ? (badgeColor || theme.palette.primary.main) : alpha(theme.palette.divider, 0.8)}`,
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    backgroundColor: selected
      ? (badgeColor || theme.palette.primary.dark)
      : alpha(theme.palette.action.selected, 0.8),
    transform: 'scale(1.08)'
  }
}))

export const GamesSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}))

export const GameRow = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.25,
  padding: theme.spacing(1.25, 1.75),
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.8)
  }
}))

export const NumbersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.6),
  flex: 1
}))

export const NumberChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'matched'
})<{ matched: boolean }>(({ theme, matched }) => ({
  backgroundColor: matched ? theme.palette.success.main : alpha(theme.palette.action.selected, 0.8),
  color: matched ? theme.palette.success.contrastText : theme.palette.text.primary,
  borderRadius: 16,
  padding: theme.spacing(0.35, 1),
  fontWeight: matched ? 700 : 500,
  fontSize: '0.8125rem',
  textAlign: 'center',
  minWidth: 30,
  boxShadow: matched ? `0 0 8px ${alpha(theme.palette.success.main, 0.4)}` : 'none'
}))

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