import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fonts are self-hosted (no requests to Google servers – GDPR-friendly).
import '@fontsource-variable/anybody/wdth.css'
import '@fontsource-variable/anybody/wdth-italic.css'
import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-600.css'
import '@fontsource/great-vibes/latin-400.css'

import './styles/tokens.css'
import './styles/base.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
