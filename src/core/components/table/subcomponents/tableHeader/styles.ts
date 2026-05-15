import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const TableHeaderContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  alignItems: 'center',
  display: 'flex',
  width: '100%'
}))

export const TitleContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(1.5),
  alignItems: 'center',
  display: 'flex'
}))

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.125rem',
  fontWeight: 600
}))

export const TotalBadgeContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.25, 1),
  fontWeight: 700,
  fontSize: 12
}))

export const HeaderActionsContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(1),
  alignItems: 'center',
  display: 'flex'
}))

export const HeaderContentWrapper = styled(Box)({
  alignItems: 'center',
  display: 'flex'
})

export const ButtonsWrapper = styled(Box)(({ theme }) => ({
  gap: theme.spacing(1),
  alignItems: 'center',
  display: 'flex'
}))

export const StyledHeaderButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  padding: '4px 12px',
  fontWeight: 600,
  height: '32px'
}))