/* eslint-disable */
import { useState } from 'react'
import { Form, Modal } from 'antd'
import { Input, Tag } from 'antd'
import { useMutation } from 'react-query'
import instance from '../../service/axiosPrivate'
import { failureModal, successModal } from '../modals'
import { IPresentation } from '../../interfaces'
import { PlusOutlined } from '@ant-design/icons'

function InviteCollaboratorsModal({
    isModalOpen,
    handleOk,
    handleCancel,
    presentationId,
}: {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
    presentationId: string
}) {
    const [tags, setTags] = useState<string[]>([])
    const [form] = Form.useForm()

    const { mutate } = useMutation((createEmailInvitationsData) => {
        return instance.post(
            '/invitation/presentation/create-email-invitations',
            createEmailInvitationsData,
        )
    })

    const handleEmailInvitations = (data: any) => {
        mutate(data, {
            onSuccess: (res) => {
                if (res?.status === 200 && res.data.ok) {
                    successModal('Invite successfully')
                } else {
                    failureModal('Failed to invite', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Failed to invite', error.response && error.response.data)
            },
        })
    }

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag)
        setTags(newTags)
    }

    const handleInputConfirm = () => {
        const inputValue = form.getFieldValue('email')
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue])
        }
        form.setFieldValue('email', '')
    }

    const forMap = (tag: string) => {
        const tagElem = (
            <Tag
                closable
                onClose={(e) => {
                    e.preventDefault()
                    handleClose(tag)
                }}
            >
                {tag}
            </Tag>
        )
        return (
            <span key={tag} style={{ display: 'inline-block', marginBottom: '6px' }}>
                {tagElem}
            </span>
        )
    }

    const tagChild = tags.map(forMap)
    return (
        <Modal
            title="Add email to invite"
            open={isModalOpen}
            okText="Invite"
            onOk={() => {
                setTags([])
                handleEmailInvitations({
                    presentationId,
                    inviteeEmails: tags,
                })
                handleOk()
            }}
            onCancel={() => {
                setTags([])
                handleCancel()
            }}
            okButtonProps={{
                disabled: tags.length === 0,
            }}
        >
            <div style={{ marginBottom: 16 }}>{tagChild}</div>
            <Form form={form} layout="horizontal">
                <Form.Item
                    name="email"
                    rules={[{ type: 'email', message: 'Invalid email format' }]}
                >
                    <Input
                        placeholder="Enter email to invite"
                        type="email"
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                        addonAfter={<PlusOutlined onClick={handleInputConfirm} />}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default InviteCollaboratorsModal
