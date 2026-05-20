import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1]
}))

export const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})