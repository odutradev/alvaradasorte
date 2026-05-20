import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { toastContainerConfig } from './config/toastConfig'
import { theme } from './theme/theme'
import { appRouter } from './router'

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ToastContainer {...toastContainerConfig} />
    <RouterProvider router={appRouter} />
  </ThemeProvider>
)

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Root not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)