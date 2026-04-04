import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TempleContextProvider from './context/TempleContext.jsx'
import { BrowserRouter } from 'react-router-dom'

// Global error handler for third-party scripts trying to load local tracking assets
window.addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG" && e.target.src && e.target.src.includes("localhost")) {
    e.preventDefault();
  }
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <TempleContextProvider>
      <App />
    </TempleContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
