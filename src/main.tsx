import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { NotFound } from './NotFound'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {['/', '/index.html'].includes(location.pathname) ? <App /> : <NotFound />}
  </StrictMode>,
)
