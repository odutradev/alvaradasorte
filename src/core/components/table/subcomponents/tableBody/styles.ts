import { TableContainer, TableHead, TableRow, Box, Typography } from '@mui/material'
import { keyframes, styled, alpha, css } from '@mui/material/styles'

const fadeAnimation = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== '$isLoading'
})<{ $isLoading?: boolean }>(({ theme, $isLoading }) => ({
  transition: theme.transitions.create(['opacity'], { duration: 500, easing: theme.transitions.easing.easeInOut }),
  opacity: $isLoading ? 0.5 : 1,
  overflowY: 'hidden',
  overflowX: 'auto',
  minHeight: 350,
  boxShadow: 'none',
  marginBottom: '-1px'
}))

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    fontWeight: 600
  }
}))

export const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== '$isLast' && prop !== '$totalInPage'
})<{ $isLast?: boolean; $totalInPage?: number }>(
  ({ theme, $isLast, $totalInPage }) => css`
    animation: ${fadeAnimation} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    & .MuiTableCell-root {
      border-bottom: ${$isLast && ($totalInPage ?? 0) >= 4 ? 0 : `1px solid ${theme.palette.divider}`};
    }
    &:hover {
      background-color: ${theme.palette.action.hover};
    }
  `
)

export const EmptyTableRow = styled(TableRow)({
  '& .MuiTableCell-root': {
    borderBottom: 0
  }
})

export const EmptyStateContainer = styled(Box)(
  ({ theme }) => css`
    animation: ${fadeAnimation} 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    color: ${theme.palette.text.secondary};
    justify-content: center;
    flex-direction: column;
    align-items: center;
    min-height: 250px;
    display: flex;
    width: 100%;
  `
)

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500
}))