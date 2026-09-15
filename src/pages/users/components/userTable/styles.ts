import { styled } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper
}))

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
  color: theme.palette.text.primary
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))
