import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TempleContextProvider from './context/TempleContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Global error handler for third-party scripts trying to load local tracking assets
window.addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG" && e.target.src && e.target.src.includes("localhost")) {
    e.preventDefault();
  }
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <TempleContextProvider>
          <App />
        </TempleContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
