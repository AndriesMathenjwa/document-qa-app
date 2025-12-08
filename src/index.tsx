import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DocumentProvider } from './context/DocumentContext'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { ColorModeProvider } from './context/ColorModeContext'

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <ColorModeProvider>
      <CssBaseline />
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </ColorModeProvider>
  </React.StrictMode>
)
