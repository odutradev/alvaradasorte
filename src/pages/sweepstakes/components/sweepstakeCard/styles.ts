import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const CardContainer = styled(Paper)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2.5),
  display: 'flex',
  gap: theme.spacing(2),
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover
  }
}))

export const InfoWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  flex: 1,
  minWidth: 0,
  gap: theme.spacing(2)
}))

export const InfoGrid = styled(Box)(({ theme }) => ({
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  display: 'grid',
  width: '100%',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}))

export const ActionsWrapper = styled(Box)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))