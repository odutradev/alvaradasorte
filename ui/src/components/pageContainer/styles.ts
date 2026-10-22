import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const RootWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullHeight'
})<{ fullHeight?: boolean }>(({ theme, fullHeight }) => ({
  flexDirection: 'column',
  display: 'flex',
  width: '100%',
  ...(fullHeight
    ? {
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          height: 'auto',
          maxHeight: 'none',
          minHeight: '100vh',
          overflow: 'visible'
        }
      }
    : {
        minHeight: '100vh'
      })
}))

export const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullHeight'
})<{ fullHeight?: boolean }>(({ theme, fullHeight }) => ({
  flexDirection: 'column',
  padding: theme.spacing(0, 4, 3),
  display: 'flex',
  width: '100%',
  flex: 1,
  boxSizing: 'border-box',
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 2)
  },
  ...(fullHeight
    ? {
        minHeight: 0,
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          minHeight: 'auto',
          overflow: 'visible',
          flex: 'none'
        }
      }
    : {})
}))
