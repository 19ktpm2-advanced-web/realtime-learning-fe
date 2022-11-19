import { Button } from 'antd'
import { failureModal } from 'components/modals'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'

export default function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('session')) navigate('/login')
    }, [localStorage.getItem('session')])

    const { mutate } = useMutation((logOutData) => {
        return instance.post('/auth/log-out', logOutData)
    })

    const handleLogOut = (data: any) => {
        mutate(data, {
            onSuccess: (res) => {
                if (res.status === 200) {
                    localStorage.removeItem('session')
                    navigate('/login')
                } else {
                    failureModal('Log out failed', res.data.message)
                }
            },
            onError: (error: any) => {
                failureModal('Log out failed', error.response && error.response.data)
            },
        })
    }

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
                    const currentSession = JSON.parse(localStorage.getItem('session') || '')
                    handleLogOut({ refreshToken: currentSession?.refreshToken })
                }}
            >
                Log out
            </Button>
        </div>
    )
}
