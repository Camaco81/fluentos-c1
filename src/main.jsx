import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import { registerSW } from './services/sw.js'

registerSW()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
