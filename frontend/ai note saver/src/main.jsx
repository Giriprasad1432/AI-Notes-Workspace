import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./AuthContext"
import { UIProvider } from './UIContext.jsx'

createRoot(document.getElementById('root')).render(

    <AuthProvider>
        <UIProvider>
            <App />
        </UIProvider>
    </AuthProvider>

)
