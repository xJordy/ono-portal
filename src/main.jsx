import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { RTL } from './theme/rtlSetup'
import { initializeAppData } from './utils/initializeData'

// Initialize mock data if localStorage is empty
initializeAppData();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RTL>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RTL>
  // </StrictMode>,
)