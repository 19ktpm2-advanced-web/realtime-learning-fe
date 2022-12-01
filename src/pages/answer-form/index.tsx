/* eslint-disable */
import { Button, Card, Form, Radio, Space } from 'antd'
import AnswerChart from '../../components/answer-chart'

import styles from './styles.module.css'

function AnswerForm() {
    const [form] = Form.useForm()

    // const { mutate } = useMutation((updateProfileData) => {
    //     return instance.post('/user/update-profile', updateProfileData)
    // })

    // const handleSubmit = (data: any) => {
    //     setIsLoading(true)
    //     mutate(data, {
    //         onSuccess: (res) => {
    //             if (res?.status === 200) {
    //                 successModal('Update profile successfully')
    //             } else {
    //                 failureModal('Update profile failed', res.statusText)
    //             }
    //             setIsLoading(false)
    //         },
    //         onError: (error: any) => {
    //             setIsLoading(false)
    //             failureModal('Update profile failed', error.response && error.response.data)
    //         },
    //     })
    // }

    const handleSubmit = (value: any) => {
        console.log(value)
    }

    return (
        <div className={styles.container}>
            <div className={styles['answer-chart']}>
                <AnswerChart />
            </div>
            <div className={styles['form-wrapper']}>
                <div className={styles['question-wrapper']}>
                    <h2>
                        Are you OK? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Assumenda est, illo nemo laborum dolorem alias enim unde perferendis. Magni
                        rerum commodi itaque optio autem quas inventore vel ipsam repellendus
                        quibusdam!
                    </h2>
                </div>
                <Form
                    layout="horizontal"
                    onFinish={handleSubmit}
                    className={styles['form']}
                    form={form}
                >
                    <Form.Item
                        name="answer"
                        rules={[
                            {
                                required: true,
                                message: 'Please choose one answer!',
                            },
                        ]}
                    >
                        <Radio.Group className={styles['radio-group']}>
                            <Space direction="vertical" className={styles['space-radio-group']}>
                                <Card>
                                    <Radio className={styles['radio-btn']} value={1}>
                                        Option A
                                    </Radio>
                                </Card>
                                <Card>
                                    <Radio className={styles['radio-btn']} value={2}>
                                        Option B
                                    </Radio>
                                </Card>
                                <Card>
                                    <Radio className={styles['radio-btn']} value={3}>
                                        Option C
                                    </Radio>
                                </Card>
                            </Space>
                        </Radio.Group>

                        <Form.Item>
                            <Button
                                className={styles['submit-btn']}
                                type="primary"
                                htmlType="submit"
                                size="large"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default AnswerForm
