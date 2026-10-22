import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const ListWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2),
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  paddingRight: theme.spacing(0.5),
  '&::-webkit-scrollbar': {
    width: 6,
    height: 6
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3
  }
}))

