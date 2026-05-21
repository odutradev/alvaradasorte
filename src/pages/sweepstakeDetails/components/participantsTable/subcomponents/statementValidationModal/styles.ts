import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const UploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6, 4),
  display: 'flex',
  cursor: 'pointer',
  gap: theme.spacing(1),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover
  }
}))

export const ColumnSelectorsContent = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(3)
}))

export const ColumnSelectorsGrid = styled(Box)(({ theme }) => ({
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  display: 'grid'
}))

export const ResultsContent = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const SummaryChips = styled(Box)(({ theme }) => ({
  flexWrap: 'wrap',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const ResultsScrollContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  maxHeight: '55vh',
  overflowY: 'auto',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const ResultSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sectionColor'
})<{ sectionColor: 'success' | 'error' | 'warning' }>(({ theme, sectionColor }) => ({
  borderLeft: `4px solid ${theme.palette[sectionColor].main}`,
  backgroundColor: `${theme.palette[sectionColor].main}14`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2)
}))

export const ResultSectionHeader = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const ResultList = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  paddingTop: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(0.5)
}))

export const ResultItem = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  alignItems: 'center',
  display: 'flex'
}))

export const ResultItemMeta = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))