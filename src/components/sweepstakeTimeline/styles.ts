import { styled, alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import type { TimelineNodeStatus } from './types'

export const Container = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  width: '100%',
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 0)
}))

export const TimelineWrapper = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
  display: 'flex',
  width: '100%'
})

export const TrackBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  position: 'absolute',
  left: '12.5%',
  right: '12.5%',
  height: 2,
  top: 26,
  zIndex: 0
}))

interface TrackProgressProps {
  progressPercentage: number
}

export const TrackProgress = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'progressPercentage'
})<TrackProgressProps>(({ theme, progressPercentage }) => ({
  backgroundColor: theme.palette.primary.main,
  transition: 'width 0.3s ease',
  width: `${progressPercentage}%`,
  position: 'absolute',
  left: '12.5%',
  height: 2,
  top: 26,
  zIndex: 0
}))

export const StepNode = styled(Box)({
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  display: 'flex',
  minWidth: 0,
  zIndex: 1,
  flex: 1
})

export const DotWrapper = styled(Box)({
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  height: 20,
  margin: '4px 0'
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
      borderRadius: '50%',
      height: 14,
      width: 14,
      transition: 'all 0.3s ease'
    }
  }

  if (status === 'completed') {
    return {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '50%',
      height: 10,
      width: 10
    }
  }

  return {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: '50%',
    height: 10,
    width: 10
  }
})

export const StepLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCurrent'
})<{ isCurrent?: boolean }>(({ theme, isCurrent }) => ({
  color: isCurrent ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: isCurrent ? 700 : 600,
  fontSize: '0.75rem',
  lineHeight: 1.2
}))

export const DateText = styled(Typography)({
  fontSize: '0.7rem',
  fontWeight: 500,
  lineHeight: 1.2
})

export const TimeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.65rem',
  lineHeight: 1.2
}))
