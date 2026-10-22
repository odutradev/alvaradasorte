import { styled, alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import type { TimelineNodeStatus } from './types'

export const Container = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  width: '100%',
  display: 'flex',
  padding: theme.spacing(0.5, 0)
}))

export const TimelineTrack = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  position: 'relative',
  display: 'flex',
  width: '100%',
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5)
}))

interface ConnectorProps {
  isCompleted: boolean
  durationMs?: number
  delayMs?: number
}

export const Connector = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCompleted' && prop !== 'durationMs' && prop !== 'delayMs'
})<ConnectorProps>(({ theme, isCompleted, durationMs = 700, delayMs = 0 }) => ({
  position: 'relative',
  backgroundColor: theme.palette.divider,
  height: 2,
  flex: 1,
  overflow: 'hidden',
  ...(isCompleted && {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      transformOrigin: 'left center',
      animation: `connectorFill ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
      animationDelay: `${delayMs}ms`
    }
  }),
  '@keyframes connectorFill': {
    from: {
      transform: 'scaleX(0)'
    },
    to: {
      transform: 'scaleX(1)'
    }
  }
}))

export const NodeAnchor = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delayMs'
})<{ delayMs?: number }>(({ delayMs = 0 }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  display: 'flex',
  flexShrink: 0,
  animation: 'nodeAnchorFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards',
  animationDelay: `${delayMs}ms`,
  '@keyframes nodeAnchorFade': {
    from: {
      opacity: 0,
      transform: 'scale(0.85)'
    },
    to: {
      opacity: 1,
      transform: 'scale(1)'
    }
  }
}))

interface DotProps {
  status: TimelineNodeStatus
  isPulsing?: boolean
}

export const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'isPulsing'
})<DotProps>(({ theme, status, isPulsing }) => {
  const pulseStyle = isPulsing
    ? {
        animation: 'dotPulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '2400ms',
        '@keyframes dotPulse': {
          '0%': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.4)}`
          },
          '50%': {
            boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.08)}`
          },
          '100%': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.4)}`
          }
        }
      }
    : {}

  if (status === 'current') {
    return {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.25)}`,
      transition: 'all 0.3s ease',
      borderRadius: '50%',
      height: 14,
      width: 14,
      zIndex: 2,
      ...pulseStyle
    }
  }

  if (status === 'completed') {
    return {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '50%',
      height: 10,
      width: 10,
      zIndex: 1,
      ...pulseStyle
    }
  }

  return {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: '50%',
    height: 10,
    width: 10,
    zIndex: 1
  }
})

interface TextPositionProps {
  align: 'start' | 'center' | 'end'
  isCurrent?: boolean
}

export const StepLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'align' && prop !== 'isCurrent'
})<TextPositionProps>(({ theme, align, isCurrent }) => ({
  color: isCurrent ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: isCurrent ? 700 : 600,
  fontSize: '0.75rem',
  lineHeight: 1.2,
  position: 'absolute',
  bottom: 'calc(100% + 6px)',
  whiteSpace: 'nowrap',
  ...(align === 'start' && { left: 0, textAlign: 'left' }),
  ...(align === 'end' && { right: 0, textAlign: 'right' }),
  ...(align === 'center' && { left: '50%', transform: 'translateX(-50%)', textAlign: 'center' })
}))

export const DateTimeText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'align' && prop !== 'isCurrent'
})<TextPositionProps>(({ theme, align, isCurrent }) => ({
  color: isCurrent ? theme.palette.primary.main : theme.palette.text.secondary,
  fontSize: '0.7rem',
  fontWeight: isCurrent ? 600 : 500,
  lineHeight: 1.2,
  position: 'absolute',
  top: 'calc(100% + 6px)',
  whiteSpace: 'nowrap',
  ...(align === 'start' && { left: 0, textAlign: 'left' }),
  ...(align === 'end' && { right: 0, textAlign: 'right' }),
  ...(align === 'center' && { left: '50%', transform: 'translateX(-50%)', textAlign: 'center' })
}))
