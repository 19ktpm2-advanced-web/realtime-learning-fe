import { Button, Form, Input, Modal } from 'antd'
import { useState } from 'react'
import instance from 'service/axiosPrivate'
import { IGroup } from '../../interfaces'

const { TextArea } = Input
function EditGroupModal({
    group,
    visible,
    setVisible,
}: {
    visible: boolean
    group: IGroup
    setVisible: Function
}) {
    const [loading, setLoading] = useState(false)
    const [editForm] = Form.useForm()
    const handleFinishEdit = async (values: { name: string; description?: string }) => {
        setLoading(true)
        await instance.put(`/group/edit/${group.id}`, values)
        setLoading(false)
        setVisible(false)
        window.location.reload()
    }
    return (
        <Modal
            open={visible}
            title="Edit Group"
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="back" onClick={() => setVisible(false)}>
                    Cancel
                </Button>,
                <Button loading={loading} key="submit" type="primary" onClick={editForm.submit}>
                    Save changes
                </Button>,
            ]}
        >
            <Form form={editForm} layout="vertical" onFinish={handleFinishEdit}>
                <Form.Item label="Group Name" name="name">
                    <Input defaultValue={group.name} />
                </Form.Item>
                <Form.Item label="Group Description" name="description">
                    <TextArea defaultValue={group.description} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default EditGroupModal
