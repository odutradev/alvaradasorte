import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const BackgroundWrapper = styled(Box)(({ theme }) => {
  const gridColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)'

  return {
    backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
    backgroundColor: theme.palette.background.default,
    backgroundPosition: 'center',
    backgroundSize: '20px 20px',
    position: 'relative',
    minHeight: '100vh',
    width: '100%'
  }
})

export const GlowOverlay = styled(Box)(({ theme }) => {
  const glowColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'

  return {
    WebkitMaskImage: 'radial-gradient(circle 250px at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)',
    backgroundImage: `linear-gradient(${glowColor} 1px, transparent 1px), linear-gradient(90deg, ${glowColor} 1px, transparent 1px)`,
    maskImage: 'radial-gradient(circle 250px at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)',
    backgroundPosition: 'center',
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 0,
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  }
})

export const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 1
})