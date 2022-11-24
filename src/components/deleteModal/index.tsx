import { Modal, Form, Button, Input } from 'antd'
import { useState } from 'react'

const DeleteModal = ({ name, onFinish }: { name: string; onFinish?: Function }) => {
    const pattern = `Delete/${name}`
    const [showDeleteModal, setShowDeleteModal] = useState(true)
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [deleteForm] = Form.useForm()
    const onChange = (e: any) => {
        setDisabled(e.target.value !== pattern)
    }

    const handleFinishDelete = async (values: { delete: string }) => {
        if (values.delete === pattern && onFinish) {
            setLoading(true)
            await onFinish()
            setLoading(false)
        }
    }
    return (
        <Modal
            title="Are you absolutely sure?"
            style={{ top: 20 }}
            open={showDeleteModal}
            onOk={deleteForm.submit}
            onCancel={() => setShowDeleteModal(false)}
        >
            <p>
                Please type <strong>{pattern}</strong> to confirm.
            </p>
            <Form form={deleteForm} layout="vertical" onFinish={handleFinishDelete}>
                <Form.Item name="delete">
                    <Input onChange={onChange} placeholder="Enter group name to confirm" />
                </Form.Item>
                <Form.Item>
                    <Button
                        loading={loading}
                        type="primary"
                        disabled={disabled}
                        danger
                        htmlType="submit"
                    >
                        I understand the consequences and delete
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default DeleteModal
