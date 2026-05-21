import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  display: 'flex',
  marginTop: 8
}))

export const StepBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2.5),
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(1.5),
  position: 'relative'
}))

export const StepBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  fontWeight: 'bold',
  height: 32,
  width: 32,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  fontSize: '1rem',
  marginBottom: theme.spacing(1)
}))

export const PixBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`
}))

export const FileUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.primary.main + '05',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'block',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '10'
  }
}))