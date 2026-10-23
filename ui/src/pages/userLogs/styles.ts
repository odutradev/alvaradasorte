import { styled, alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const ContainerWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  gap: theme.spacing(2.5),
  height: '100%',
  minHeight: 0,
  flex: 1,
  overflow: 'hidden',
  boxSizing: 'border-box',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    overflow: 'visible',
    flex: 'none'
  }
}))

export const LogsListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  paddingRight: theme.spacing(0.5),
  '&::-webkit-scrollbar': {
    width: 6,
    height: 6
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 3
  },
  [theme.breakpoints.down('md')]: {
    overflowY: 'visible',
    flex: 'none'
  }
}))

export const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

export const LogItemCard = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.25),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: isDark ? alpha('#1e293b', 0.4) : '#f8fafc',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.05)'
    }
  }
})
