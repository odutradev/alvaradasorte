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
  height: '100%',
  gap: theme.spacing(2)
}))

export const SearchContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
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
  overflowY: 'auto',
  display: 'flex',
  flex: 1,
  gap: theme.spacing(2),
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.divider} transparent`,
  '&::-webkit-scrollbar': {
    width: 6
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3,
    '&:hover': {
      backgroundColor: theme.palette.text.disabled
    }
  }
}))
