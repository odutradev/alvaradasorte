import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const Z_INDEX_OVERLAY = 9999

export const FormContainer = styled('form')(({ theme }) => ({
  flex: 1,
  width: '100%',
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper
}))

export const StepContainer = styled(Box)<{ $hasIndicator?: boolean }>(({ theme, $hasIndicator }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginTop: $hasIndicator ? theme.spacing(4) : 0
}))

export const LoadingOverlay = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  position: 'fixed',
  alignItems: 'center',
  zIndex: Z_INDEX_OVERLAY,
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  opacity: 0.8
}))