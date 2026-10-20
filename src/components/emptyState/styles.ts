import { styled, alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const Container = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.background.paper, 0.7)
      : alpha(theme.palette.background.paper, 0.4),
  border: `1px dashed ${alpha(theme.palette.divider, 0.8)}`,
  borderRadius: 16,
  padding: theme.spacing(5, 3),
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  boxSizing: 'border-box',
  gap: theme.spacing(1.5),
  boxShadow: 'none'
}))

export const IconWrapper = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.12),
  color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
  border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.16 : 0.24)}`,
  marginBottom: theme.spacing(0.5)
}))