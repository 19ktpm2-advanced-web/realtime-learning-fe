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
import PresentationInvitationModal from './presentation-invitation-modal'

export default function Home() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<IUser>()
    // Get invitationId from loader if any
    const loader: any = useLoaderData()
    // Get invitationId if redirect from login
    const { state } = useLocation()
    const [isGroupInvitationModalOpen, setIsGroupInvitationModalOpen] = useState(false)
    const [groupInvitation, setGroupInvitation] = useState<IInvitation>()
    const [isPresentationInvitationModalOpen, setIsPresentationInvitationModalOpen] =
        useState(false)
    const [presentationInvitation, setPresentationInvitation] = useState<IInvitation>()

    const groupInvitationId =
        (state && state.groupInvitationId) ||
        (loader && loader.invitationType === InvitationType.GROUP_INVITATION && loader.invitationId)

    const presentationInvitationId =
        (state && state.presentationInvitationId) ||
        (loader &&
            loader.invitationType === InvitationType.PRESENTATION_INVITATION &&
            loader.invitationId)

    useEffect(() => {
        if (!localStorage.getItem('session')) {
            navigate('/login', {
                state: { groupInvitationId, presentationInvitationId },
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
        if (groupInvitationId && profile) {
            instance.get(`/invitation/${groupInvitationId}`).then((res) => {
                if (res?.status === 200) {
                    const {
                        invitation,

                        isMemberOfGroup,
                    }: {
                        invitation: IInvitation
                        isMemberOfGroup: boolean
                    } = res.data

                    if (isMemberOfGroup) navigate(`/group/${invitation.group?.id}`)
                    else if (invitation) {
                        if (
                            invitation.type === InvitationType.EMAIL_INVITATION &&
                            invitation.inviteeEmail !== profile.email
                        )
                            return
                        setGroupInvitation(invitation)
                        setIsGroupInvitationModalOpen(true)
                    }
                }
            })
        }
    }, [profile])

    useEffect(() => {
        if (presentationInvitationId && profile) {
            instance.get(`/invitation/presentation/${presentationInvitationId}`).then((res) => {
                if (res?.status === 200) {
                    const invitation: IInvitation = res.data

                    if (
                        invitation &&
                        invitation.type === InvitationType.EMAIL_INVITATION &&
                        invitation.inviteeEmail !== profile.email
                    )
                        return
                    setPresentationInvitation(invitation)
                    setIsPresentationInvitationModalOpen(true)
                }
            })
        }
    }, [profile])

    return (
        <>
            <JoinGroup />
            <InvitationModal
                isModalOpen={isGroupInvitationModalOpen}
                handleOk={() => setIsGroupInvitationModalOpen(false)}
                handleCancel={() => setIsGroupInvitationModalOpen(false)}
                data={groupInvitation}
            />
            <PresentationInvitationModal
                isModalOpen={isPresentationInvitationModalOpen}
                handleOk={() => setIsPresentationInvitationModalOpen(false)}
                handleCancel={() => setIsPresentationInvitationModalOpen(false)}
                data={presentationInvitation}
            />
        </>
    )
}
