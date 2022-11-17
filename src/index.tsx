import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Profile from './pages/profile'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Profile />
    </React.StrictMode>,
)
