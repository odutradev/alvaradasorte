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
}

export const Connector = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCompleted'
})<ConnectorProps>(({ theme, isCompleted }) => ({
  backgroundColor: isCompleted ? theme.palette.primary.main : theme.palette.divider,
  transition: 'background-color 0.3s ease',
  height: 2,
  flex: 1
}))

export const NodeAnchor = styled(Box)({
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  display: 'flex',
  flexShrink: 0
})

interface DotProps {
  status: TimelineNodeStatus
}

export const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status'
})<DotProps>(({ theme, status }) => {
  if (status === 'current') {
    return {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.25)}`,
      transition: 'all 0.3s ease',
      borderRadius: '50%',
      height: 14,
      width: 14,
      zIndex: 2
    }
  }

  if (status === 'completed') {
    return {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '50%',
      height: 10,
      width: 10,
      zIndex: 1
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
