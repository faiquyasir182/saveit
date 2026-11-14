import '@fontsource-variable/figtree'
import '@fontsource/noto-nastaliq-urdu/arabic-400.css'
import '@fontsource/noto-nastaliq-urdu/arabic-700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyBrandTokens } from './config/brand'

applyBrandTokens()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
