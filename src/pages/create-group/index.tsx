import { useMutation } from 'react-query'
import { Button, Card, Form, Input } from 'antd'
import { failureModal, successModal } from 'components/modals'
import instance from 'service/axiosPrivate'
import TextArea from 'antd/lib/input/TextArea'
import UploadAvatar from 'components/upload-avatar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

function CreateGroup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { mutate } = useMutation((groupData: any) => {
        return instance.post('/group/create', {
            name: groupData.name,
            description: groupData.description,
            avatar: groupData.avatar,
        })
    })
    const handleSubmit = (data: any) => {
        setLoading(true)
        mutate(data, {
            onSuccess: (res: any) => {
                setLoading(false)
                if (res?.status === 200) {
                    successModal('Successful', 'Create group successfully')
                    navigate('/my-group')
                } else {
                    failureModal('Failed', res.statusText)
                }
            },
            onError: (error: any) => {
                setLoading(false)
                failureModal('Failed', error.response && error.response.data)
            },
        })
    }
    return (
        <div className={styles.formWrapper}>
            <Card
                className={styles.card}
                title={
                    <div className={styles.title}>
                        <div>Create Group</div>
                    </div>
                }
            >
                <Form form={form} onFinish={handleSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout="horizontal">
                    <Form.Item label="Avatar" name="avatar">
                        <UploadAvatar formRef={form} />
                    </Form.Item>
                    <Form.Item label="Name" name="name">
                        <Input placeholder="Enter group name here" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <TextArea rows={4} placeholder="Enter group description here" />
                    </Form.Item>
                    <Form.Item className={styles.cardFooter}>
                        <Button loading={loading} className={styles.saveBtn} type="primary" htmlType="submit" size="large">
                            Save new group
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default CreateGroup
