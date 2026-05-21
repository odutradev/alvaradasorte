import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2)
}))

export const InfoRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const DividerLine = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  height: '1px',
  width: '100%'
}))

export const ProgressContainer = styled(Box)({
  width: '100%'
})

export const ProgressHeader = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  display: 'flex',
  marginBottom: theme.spacing(1)
}))

export const ProgressBarTrack = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  height: '8px',
  width: '100%'
}))

export const ProgressBarFill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'percentage'
})<{ percentage: number }>(({ theme, percentage }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  width: `${percentage}%`,
  height: '100%'
}))

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(2)
}))

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3)
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    overflow: 'hidden'
  },
  '& .MuiInputBase-root': {
    overflow: 'hidden'
  },
  backgroundColor: theme.palette.action.hover
}))

export const StyledTextButton = styled(Button)({
  alignSelf: 'flex-start',
  padding: 0
})