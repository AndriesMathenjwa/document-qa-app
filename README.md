# Document Q&A App (React + TypeScript + Gemini AI)

A full Document Question & Answer application built with React + TypeScript and powered by a small Node.js backend that connects to Gemini AI for real document analysis.

# Live Links

Frontend: https://document-qa-app-eta.vercel.app/

Backend API: https://document-qa-app-server.onrender.com/api/ask
(Render may take ±30–50 seconds to wake up on first use.)

# Features
Drag-and-drop document upload (simulated progress)
Document library with metadata
Ask questions with real-time character count
Q&A history per document
Search across Q&A (debounced)
Dark/Light mode
Keyboard shortcuts
Export Q&A as JSON
Toast notifications
Gemini AI responses via backend

## Keyboard Shortcuts:
Alt + Q Focus question input
Ctrl/Cmd Enter Ask question

## Installation
Frontend
git clone git@github.com:AndriesMathenjwa/document-qa-app.git
cd document-qa-frontend
npm install
npm start
# Runs at http://localhost:3000

Backend
git clone git@github.com:AndriesMathenjwa/document-qa-app-server.git
cd document-qa-app-server
npm install
npm start
# Runs at http://localhost:4000

# Optional: Use local backend
In src/lib/gemini.ts, change the live link to:
const API_URL = "http://localhost:4000/api/ask";


# Notes
Backend (Render) sleeps when idle the first AI request may be slow.
All document + Q&A data persists in localStorage.
Built using React, TypeScript, MUI, Framer Motion.