/* eslint-disable */
import { useState } from 'react'
import { Form, Modal } from 'antd'
import { Input, Tag } from 'antd'
import './index.css'

function InviteByEmailModal({
    isModalOpen,
    handleOk,
    handleCancel,
}: {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
}) {
    const [tags, setTags] = useState<string[]>([])
    const [form] = Form.useForm()

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
                handleOk()
            }}
            onCancel={() => {
                setTags([])
                handleCancel()
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
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default InviteByEmailModal
