import { styled } from '@mui/material/styles'
import { Select, Box } from '@mui/material'

export const PaginationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$justify'
})<{ $justify?: string }>(({ theme, $justify }) => ({
  justifyContent: $justify || 'space-between',
  gap: $justify !== 'space-between' ? theme.spacing(4) : 0,
  padding: theme.spacing(2),
  alignItems: 'center',
  display: 'flex',
  flex: 1
}))

export const LimitContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  alignItems: 'center',
  display: 'flex'
}))

export const StyledSelect = styled(Select<number>)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(0.5, 3, 0.5, 1)
  },
  '& fieldset': {
    border: 'none'
  },
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem'
}))