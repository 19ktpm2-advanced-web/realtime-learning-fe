import { useEffect, useState } from 'react'
import PresentationList from 'components/presentationList'
import { IPresentation } from 'interfaces'
import { Button, Form, Input, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { failureModal } from 'components/modals'
import ProgressBar from 'components/progress-bar'
import { useNavigate } from 'react-router-dom'
import instance from '../../service/axiosPrivate'
import styles from './styles.module.css'

function Presentation() {
    const [presentations, setPresentations] = useState<IPresentation[]>([])
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        try {
            ;(async () => {
                const response = await instance.get('/presentation/get-all')
                if (response.status === 200) {
                    setPresentations(response.data)
                } else {
                    failureModal('Something went wrong')
                }
                setLoading(false)
            })()
        } catch (e) {
            failureModal(e)
        }
    }, [])
    const [createForm] = Form.useForm()
    const handleFinishCreate = async (values: { name: string }) => {
        const newPresentation = {
            name: values.name,
        }
        setLoading(true)
        try {
            const result = await instance.post('/presentation/create', newPresentation)
            if (result.status === 200) {
                setPresentations([...presentations, result.data])
                setLoading(false)
                setIsVisibleModal(false)
                navigate(`/presentation/${result.data.id}`)
            } else {
                failureModal('Create presentation failed', result.data.message)
                setLoading(false)
                setIsVisibleModal(false)
            }
        } catch (error) {
            failureModal('Create presentation failed', error.response && error.response.data)
            setLoading(false)
            setIsVisibleModal(false)
        }
    }
    return (
        <div className={styles.container}>
            <div>My Presentations</div>
            <div className={styles.headerWrapper}>
                <Button
                    className={styles.addNewPresentationBtn}
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setIsVisibleModal(true)}
                >
                    New presentation
                </Button>
            </div>
            <PresentationList presentations={presentations} />
            <Modal
                visible={isVisibleModal}
                okText="Create Presentation"
                onOk={() => {
                    createForm.submit()
                }}
                onCancel={() => setIsVisibleModal(false)}
                width={1000}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleFinishCreate}
                    wrapperCol={{ span: 24 }}
                    style={{ marginTop: '16px' }}
                >
                    <h2>Create New Presentation</h2>
                    <Form.Item name="name">
                        <Input placeholder="Enter presentation name here ..." />
                    </Form.Item>
                </Form>
                <ProgressBar loading={loading} />
            </Modal>
        </div>
    )
}
export default Presentation
