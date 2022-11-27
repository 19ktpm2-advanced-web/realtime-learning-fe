/* eslint-disable */
import dayjs from '../../utils/dayjs.util'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import { IInvitation, IUser } from '../../interfaces'
import JoinGroup from '../join-group'
import InvitationModal from './invitation.modal'
import InvitationType from '../../enums/invitation.enum'

export default function Home() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<IUser>()
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

    useQuery(['profile'], async () => {
        const res = await instance.get('/user/profile')

        const profile = {
            ...res.data,
            dateOfBirth: dayjs(res.data.dateOfBirth),
        }
        localStorage.setItem('profile', JSON.stringify(profile))
        setProfile(profile)
    })

    useEffect(() => {
        if (invitationId && profile) {
            instance.get(`/invitation/${invitationId}`).then((res) => {
                if (res?.status === 200) {
                    const {
                        invitation,

                        isMemberOfGroup,
                    }: {
                        invitation: IInvitation
                        isMemberOfGroup: boolean
                    } = res.data

                    if (isMemberOfGroup) navigate(`/group/${invitation.group.id}`)
                    else if (invitation) {
                        if (
                            invitation.type === InvitationType.EMAIL_INVITATION &&
                            invitation.inviteeEmail !== profile.email
                        )
                            return
                        setInvitation(invitation)
                        setIsInvitationModalOpen(true)
                    }
                }
            })
        }
    }, [profile])

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
