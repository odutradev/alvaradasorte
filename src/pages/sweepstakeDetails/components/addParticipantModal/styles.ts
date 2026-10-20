import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const UserListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxHeight: 340,
  overflowY: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
}))

export const UserListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-1px)'
  }
}))

export const SelectedUserCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.action.selected,
  gap: theme.spacing(2)
}))

export const QuotaSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}))
