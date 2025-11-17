import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProtótipoMapa3D from './components/Map.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App />aw */}
    <ProtótipoMapa3D />
  </StrictMode>,
)



