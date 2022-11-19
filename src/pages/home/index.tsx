import { Button } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('session')) navigate('/login')
    }, [localStorage.getItem('session')])

    return (
        <div
            id="home"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <h1>Welcome to home page!</h1>
            <Button
                style={{
                    backgroundColor: '#1046c7',
                    color: 'white',
                    padding: '16px 20px',
                    margin: '8px 0',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.9,
                }}
                onClick={() => {
                    navigate('/profile')
                }}
            >
                Profile
            </Button>
            <Button
                style={{
                    backgroundColor: '#1046c7',
                    color: 'white',
                    padding: '16px 20px',
                    margin: '8px 0',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.9,
                }}
                className="logout-btn"
                onClick={() => {
                    localStorage.removeItem('session')
                    navigate('/login')
                }}
            >
                Log out
            </Button>
        </div>
    )
}
