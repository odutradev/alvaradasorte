import { styled } from '@mui/material/styles'

import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const TableContainerWrapper = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
  height: '100%',
  minHeight: 0,
  flex: 1,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  boxSizing: 'border-box'
}))





export const TableHeader = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}))

export const ActionsContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '& > *': {
      flex: 1
    }
  }
}))