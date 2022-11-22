/* eslint-disable */
import { useState } from 'react'
import { Button, Card, Input, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import './index.css'
import InviteByEmailModal from './invite-by-email.modal'

function InvitationCard() {
    const [invitationLink, setInvitationLink] = useState('')
    const [messageApi, contextHolder] = message.useMessage()

    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)

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

                <InviteByEmailModal
                    isModalOpen={isInvitationModalOpen}
                    handleOk={() => setIsInvitationModalOpen(false)}
                    handleCancel={() => setIsInvitationModalOpen(false)}
                />
            </Card>
        </>
    )
}

export default InvitationCard
