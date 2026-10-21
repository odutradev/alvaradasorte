import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2.5),
  display: 'flex',
  gap: theme.spacing(2),
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover
  }
}))

export const InfoWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  flex: 1,
  minWidth: 0,
  gap: theme.spacing(2)
}))

export const InfoGrid = styled(Box)(({ theme }) => ({
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  display: 'grid',
  width: '100%',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}))

export const ActionsWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const GamesPreviewWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : '#f8fafc',
    border: `1px solid ${isDark ? '#2e3244' : '#e2e8f0'}`,
    borderRadius: 8,
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(0.5)
  }
})

export const MiniNumberChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'matched'
})<{ matched?: boolean }>(({ theme, matched }) => {
  const isDark = theme.palette.mode === 'dark'
  if (matched) {
    return {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      border: '1px solid #4ade80',
      borderRadius: '50%',
      width: 24,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.7rem',
      lineHeight: 1
    }
  }

  return {
    backgroundColor: isDark ? '#262937' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
    border: `1px solid ${isDark ? '#3d4257' : '#cbd5e1'}`,
    borderRadius: '50%',
    width: 24,
    height: 24,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.7rem',
    lineHeight: 1
  }
})