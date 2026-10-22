import { styled, alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const SyncContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.6)
}))

export const SyncHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  flexWrap: 'wrap'
})

export const InfoStatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5)
}))

export const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: theme.spacing(1),
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.text.primary, 0.03),
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
}))

export const AttemptsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  maxHeight: 240,
  overflowY: 'auto',
  paddingRight: theme.spacing(0.5),
  '&::-webkit-scrollbar': {
    width: 4
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 2
  }
}))

export const AttemptItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSuccess'
})<{ isSuccess?: boolean }>(({ theme, isSuccess }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: theme.spacing(1, 1.5),
  borderRadius: 8,
  fontSize: '0.8125rem',
  backgroundColor: isSuccess
    ? alpha(theme.palette.success.main, 0.08)
    : alpha(theme.palette.text.primary, 0.03),
  borderLeft: `3px solid ${isSuccess ? theme.palette.success.main : theme.palette.warning.main}`
}))
