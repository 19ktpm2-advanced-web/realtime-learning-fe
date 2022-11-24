/* eslint-disable */
import { Button } from 'antd'
import { failureModal } from 'components/modals'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import InvitationModal from './invitation.modal'

export default function Home() {
    const navigate = useNavigate()
    // Get invitationId from loader if any
    const loader = useLoaderData()
    // Get invitationId if redirect from login
    const { state } = useLocation()
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)
    const [invitation, setInvitation] = useState()
    const invitationId = (state && state.invitationId) || loader

    useEffect(() => {
        if (!localStorage.getItem('session')) {
            navigate('/login', {
                state: { invitationId },
            })
        }
    }, [localStorage.getItem('session')])

    useEffect(() => {
        if (isInvitationModalOpen) {
            instance.get(`/invitation/${invitationId}`).then((res) => {
                if (res?.status === 200) {
                    setInvitation(res.data)
                    setIsInvitationModalOpen(true)
                } else throw new Error('Not found')
            })
        }
    }, [])

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
                    margin: '8px 0',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.9,
                }}
                className="logout-btn"
                onClick={() => {
                    navigate('/my-group')
                }}
            >
                My Groups
            </Button>
            <Button
                style={{
                    backgroundColor: '#1046c7',
                    color: 'white',
                    margin: '8px 0',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.9,
                }}
                className="logout-btn"
                onClick={() => {
                    navigate('/join-group')
                }}
            >
                Join Groups
            </Button>
            <Button
                style={{
                    backgroundColor: '#1046c7',
                    color: 'white',
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

            <InvitationModal
                isModalOpen={isInvitationModalOpen}
                handleOk={() => setIsInvitationModalOpen(false)}
                handleCancel={() => setIsInvitationModalOpen(false)}
                data={invitation}
            />
        </div>
    )
}
