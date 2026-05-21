import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2),
  display: 'flex',
  marginTop: 4
}))

export const InstructionBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const FileUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.primary.main + '05',
  padding: theme.spacing(2.5),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'block',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '10'
  }
}))