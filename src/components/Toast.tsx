import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useDocumentContext } from '../context/DocumentContext'

export default function Toasts() {
  const { toasts, removeToast } = useDocumentContext()

  return (
    <>
      {toasts.map((t, i) => (
        <Snackbar
          key={i}
          open
          autoHideDuration={3000}
          onClose={() => removeToast(i)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="info" onClose={() => removeToast(i)}>
            {t}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}
