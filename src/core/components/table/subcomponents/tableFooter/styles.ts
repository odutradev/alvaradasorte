import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const TableFooterContainer = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  width: '100%'
}))

export const CustomFooterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  alignItems: 'center',
  display: 'flex'
}))