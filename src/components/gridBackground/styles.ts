import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const BackgroundWrapper = styled(Box)(({ theme }) => {
  const gridColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)'

  return {
    backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
    backgroundColor: theme.palette.background.default,
    backgroundPosition: 'center',
    backgroundSize: '20px 20px',
    minHeight: '100vh',
    width: '100%'
  }
})