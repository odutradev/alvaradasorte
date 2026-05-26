import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const SectionContainer = styled(Box)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.success.main}`,
  backgroundColor: `${theme.palette.success.main}14`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2)
}))

export const SectionHeader = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})

export const ListContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  paddingTop: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(0.5)
}))

export const ListItem = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  alignItems: 'flex-start',
  display: 'flex',
  gap: theme.spacing(1.5)
}))

export const ItemHeaderRow = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  width: '100%'
})

export const RowsContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  borderLeft: `2px solid ${theme.palette.divider}`,
  paddingLeft: theme.spacing(2),
  display: 'flex',
  width: '100%',
  gap: theme.spacing(1)
}))

export const SingleRowItem = styled(Box)({
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex'
})