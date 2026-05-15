import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  width: '100%'
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%'
}))