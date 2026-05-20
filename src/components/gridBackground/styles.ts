import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const BackgroundWrapper = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)`,
  backgroundColor: theme.palette.background.default,
  backgroundPosition: 'center',
  backgroundSize: '40px 40px',
  minHeight: '100vh',
  width: '100%'
}))