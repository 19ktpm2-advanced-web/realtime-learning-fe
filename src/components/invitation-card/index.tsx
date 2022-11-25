/* eslint-disable */
import { useEffect, useState } from 'react'
import { Button, Card, Input, message, Spin } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import './index.css'
import InviteByEmailModal from './invite-by-email.modal'
import instance from '../../service/axiosPrivate'
import { useMutation } from 'react-query'
import { failureModal } from '../modals'
import { IGroup, IInvitation } from '../../interfaces'
import { generateInvitationLink } from '../../utils/invitation.util'

function InvitationCard({ group }: { group: IGroup }) {
    const [invitationLink, setInvitationLink] = useState('')
    const [messageApi, contextHolder] = message.useMessage()
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)

    useEffect(() => {
        createSharedInvitation({
            groupId: group.id,
        })
    }, [])

    const { mutate } = useMutation((createSharedInvitationData) => {
        return instance.post('/invitation/create-shared-invitation', createSharedInvitationData)
    })

    const createSharedInvitation = (data: any) => {
        mutate(data, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    const invitation: IInvitation = res.data
                    const invitationLink = generateInvitationLink(invitation.id)
                    setInvitationLink(invitationLink)
                } else {
                    failureModal('Failed to get invitation link', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Failed to get invitation link', error.response && error.response.data)
            },
        })
    }

    const handleCopyIconClick = () => {
        navigator.clipboard.writeText(invitationLink)
        messageApi.info('Copied to clipboard')
    }

    return (
        <>
            <Card
                size="small"
                title="Invitation Link"
                extra={
                    <Button type="primary" onClick={() => setIsInvitationModalOpen(true)}>
                        Invite
                    </Button>
                }
                style={{ width: 300 }}
            >
                {invitationLink === '' ? (
                    <div className="spin-wrapper">
                        <Spin />
                    </div>
                ) : (
                    <Input
                        placeholder="Invitation link"
                        disabled
                        value={invitationLink}
                        addonAfter={
                            <>
                                {contextHolder}
                                <CopyOutlined onClick={handleCopyIconClick} />
                            </>
                        }
                    />
                )}

                <InviteByEmailModal
                    isModalOpen={isInvitationModalOpen}
                    handleOk={() => setIsInvitationModalOpen(false)}
                    handleCancel={() => setIsInvitationModalOpen(false)}
                    group={group}
                />
            </Card>
        </>
    )
}

export default InvitationCard
