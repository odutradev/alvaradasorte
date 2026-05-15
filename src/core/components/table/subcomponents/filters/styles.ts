import { Box, Dialog, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[10],
    padding: 0
  }
}))

export const HeaderContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  alignItems: 'center',
  display: 'flex'
}))

export const FilterTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.25rem',
  fontWeight: 600
}))

export const FormWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3)
}))