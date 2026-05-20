import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#D81313',
      light: '#f24444',
      dark: '#a80d0d'
    },
    secondary: {
      main: '#f50057'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)'
    }
  },
  typography: {
    fontFamily: ['Montserrat', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '3.2em',
      fontWeight: 700,
      lineHeight: 1.1
    },
    h6: {
      fontSize: '1em',
      fontWeight: 500
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #ffffff inset !important',
            WebkitTextFillColor: 'rgba(0, 0, 0, 0.87) !important',
            caretColor: 'rgba(0, 0, 0, 0.87)',
            borderRadius: 'inherit'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'border-color 0.25s, background-color 0.25s, color 0.25s',
          textTransform: 'none',
          padding: '0.6em 1.2em',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '1em',
          '&:hover': {
            borderColor: '#D81313'
          },
          '&:focus-visible': {
            outline: '4px auto -webkit-focus-ring-color'
          }
        }
      }
    }
  }
})