import { styled, alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const ContainerWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  gap: theme.spacing(2.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}))

export const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

export const FiltersBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.mode === 'dark' ? alpha('#1e293b', 0.5) : '#f8fafc',
  border: `1px solid ${theme.palette.divider}`
}))

export const LogCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'level'
})<{ level?: 'info' | 'warn' | 'error' }>(({ theme, ...props }) => {
  const isDark = theme.palette.mode === 'dark'
  const lvl = (props.level || 'info') as 'info' | 'warn' | 'error'

  const levelStyles: Record<'info' | 'warn' | 'error', { borderLeft: string; bg: string; borderColor: string }> = {
    error: {
      borderLeft: '4px solid #ef4444',
      bg: isDark ? alpha('#ef4444', 0.08) : alpha('#ef4444', 0.04),
      borderColor: isDark ? alpha('#ef4444', 0.3) : alpha('#ef4444', 0.25)
    },
    warn: {
      borderLeft: '4px solid #f59e0b',
      bg: isDark ? alpha('#f59e0b', 0.08) : alpha('#f59e0b', 0.04),
      borderColor: isDark ? alpha('#f59e0b', 0.3) : alpha('#f59e0b', 0.25)
    },
    info: {
      borderLeft: '4px solid #3b82f6',
      bg: isDark ? alpha('#1e293b', 0.4) : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0'
    }
  }

  const current = levelStyles[lvl] || levelStyles.info

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.25),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: current.bg,
    border: `1px solid ${current.borderColor}`,
    borderLeft: current.borderLeft,
    transition: 'all 0.15s ease',
    '&:hover': {
      boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.06)'
    }
  }
})

export const ErrorBox = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
    border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5'}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  }
})

export const CodeBlock = styled('pre')(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    margin: 0,
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isDark ? '#0b0f19' : '#1e293b',
    color: '#e2e8f0',
    fontSize: '0.75rem',
    fontFamily: 'Consolas, Monaco, monospace',
    overflowX: 'auto',
    maxHeight: 220
  }
})
