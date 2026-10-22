import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FormContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  display: 'flex'
}))

export const TopRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1.5),
  alignItems: 'stretch',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr'
  }
}))

export const BottomRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: theme.spacing(1.5),
  alignItems: 'stretch',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr'
  }
}))

export const InstructionBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1.25, 1.75),
  flexDirection: 'column',
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(0.5)
}))

export const FileUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.primary.main + '05',
  padding: theme.spacing(1.5),
  transition: 'all 0.2s',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  minHeight: 96,
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '10'
  }
}))

export const FileStatusRow = styled(Box)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const QuantityContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  display: 'flex',
  padding: theme.spacing(1.25, 1.75),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.background.paper
}))

export const QuantityControl = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const TotalSummaryBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  display: 'flex',
  padding: theme.spacing(1.25, 1.75),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.primary.main + '12',
  border: `1px solid ${theme.palette.primary.main + '30'}`
}))

export const SuggestionToggleBox = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  padding: theme.spacing(1.25, 1.75),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.background.paper
}))

export const CompactNumberGrid = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1),
    backgroundColor: isDark ? '#14161f' : '#f8fafc',
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${isDark ? '#2e3244' : '#e2e8f0'}`,
    justifyItems: 'center',
    alignItems: 'center'
  }
})
