import { styled } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    width: 6,
    height: 6
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3
  }
}))
