import { styled, alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CompactSyncContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 1.25),
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.4)
}))

export const SyncRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8
})
