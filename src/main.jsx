import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { RTL } from './theme/rtlSetup'
import { initializeFirestore } from './firebase'

// Initialize Firestore instead of local storage
initializeFirestore().then(() => {
  console.log('Firebase initialized successfully');
}).catch(err => {
  console.error('Error initializing Firebase:', err);
});

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RTL>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RTL>
  // </StrictMode>
)