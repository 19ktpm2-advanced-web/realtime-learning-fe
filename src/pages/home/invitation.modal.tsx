/* eslint-disable */
import { useState } from 'react'
import { Form, Modal } from 'antd'
import './index.css'
import { IInvitation } from '../../interfaces'
import { useMutation } from 'react-query'
import instance from '../../service/axiosPrivate'
import { failureModal, successModal } from '../../components/modals'

function InvitationModal({
    isModalOpen,
    handleOk,
    handleCancel,
    data,
}: {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
    data: IInvitation | undefined
}) {
    const { mutate } = useMutation((acceptInvitationData) => {
        return instance.post('/invitation/accept-invitation', acceptInvitationData)
    })

    const handleAcceptInvitation = (data: any) => {
        mutate(data, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    successModal('Join group successfully')
                    handleOk()
                } else {
                    failureModal('Join group failed', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Join group failed', error.response && error.response.data)
            },
        })
    }

    return (
        <Modal
            title="Invitation"
            open={isModalOpen}
            okText="Accept"
            onOk={() => {
                handleAcceptInvitation({ invitationId: data?.id })
            }}
            onCancel={handleCancel}
            width={300}
        >
            <p>
                You are invited to join <b>{data?.group?.name}</b> by{' '}
                <b>{data?.inviter.fullName}</b>
            </p>
        </Modal>
    )
}

export default InvitationModal
