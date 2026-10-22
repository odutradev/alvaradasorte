import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.palette.primary.main} transparent`,
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '4px',
      border: `2px solid ${theme.palette.background.paper || '#ffffff'}`
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.palette.primary.dark || '#624cab'
    }
  },
  backgroundColor: 'transparent'
}))