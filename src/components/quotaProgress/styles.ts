import { styled } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

export const ProgressWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  width: '100%',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const LabelRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  height: 8,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.action.hover
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main
  }
}))