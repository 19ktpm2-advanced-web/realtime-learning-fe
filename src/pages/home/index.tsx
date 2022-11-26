/* eslint-disable */
import { useEffect, useState } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import { IInvitation } from '../../interfaces'
import JoinGroup from '../join-group'
import InvitationModal from './invitation.modal'

export default function Home() {
    const navigate = useNavigate()
    // Get invitationId from loader if any
    const loader = useLoaderData()
    // Get invitationId if redirect from login
    const { state } = useLocation()
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)
    const [invitation, setInvitation] = useState<IInvitation>()
    const invitationId = (state && state.invitationId) || loader

    useEffect(() => {
        if (!localStorage.getItem('session')) {
            navigate('/login', {
                state: { invitationId },
            })
        }
    }, [localStorage.getItem('session')])

    useEffect(() => {
        if (invitationId) {
            instance.get(`/invitation/${invitationId}`).then((res) => {
                if (res?.status === 200) {
                    const {
                        invitation,
                        isMemberOfGroup,
                    }: {
                        invitation: IInvitation
                        isMemberOfGroup: boolean
                    } = res.data
                    if (invitation && !isMemberOfGroup) {
                        setInvitation(invitation)
                        setIsInvitationModalOpen(true)
                    } else navigate(`/group/${invitation.group.id}`)
                }
            })
        }
    }, [])

    return (
        <>
            <JoinGroup />
            <InvitationModal
                isModalOpen={isInvitationModalOpen}
                handleOk={() => setIsInvitationModalOpen(false)}
                handleCancel={() => setIsInvitationModalOpen(false)}
                data={invitation}
            />
        </>
    )
}
