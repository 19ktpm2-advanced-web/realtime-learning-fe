/* eslint-disable */
import { Form, Input, Radio, DatePicker, Tabs, Button } from 'antd'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import UploadAvatar from '../../components/upload-avatar'
import './index.css'

function Profile() {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    useQuery(['profile'], async () => {
        const res = await instance.get('/user/profile')
        form.setFieldsValue({
            email: res.data.email,
            fullName: res.data.fullName,
        })
        return res.data
    })

    useEffect(() => {
        if (!localStorage.getItem('session')) navigate('/login')
    }, [localStorage.getItem('session')])

    const onChange = (key: string) => {
        console.log(key)
    }

    const onFinish = (values: any) => {
        console.log('Success:', values)
    }

    return (
        <Tabs
            centered
            defaultActiveKey="1"
            onChange={onChange}
            items={[
                {
                    label: 'Profile',
                    key: '1',
                    children: (
                        <Form
                            form={form}
                            onFinish={onFinish}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 10 }}
                            layout="horizontal"
                            className="form-wrapper"
                        >
                            <Form.Item label="Avatar" valuePropName="avatar">
                                <UploadAvatar />
                            </Form.Item>
                            <Form.Item label="Email" name="email">
                                <Input placeholder="Ex: abc@gmail.com" disabled />
                            </Form.Item>
                            <Form.Item label="Full name" name="fullName">
                                <Input placeholder="Ex: John Smith" />
                            </Form.Item>
                            <Form.Item
                                label="Phone number"
                                name="phoneNumber"
                                rules={[{ len: 10, message: 'Phone number must include 10 numbers' }]}
                            >
                                <Input placeholder="Ex: 0123456789" />
                            </Form.Item>
                            <Form.Item label="Gender">
                                <Radio.Group>
                                    <Radio value="male"> Male </Radio>
                                    <Radio value="female"> Female </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Date of birth">
                                <DatePicker />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    ),
                },
                {
                    label: 'Security',
                    key: '2',
                    children: (
                        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} layout="horizontal" className="form-wrapper">
                            <Form.Item label="Current password">
                                <Input.Password />
                            </Form.Item>
                            <Form.Item label="New password">
                                <Input.Password />
                            </Form.Item>
                            <Form.Item label="Re-enter new password">
                                <Input.Password />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
                                <Button type="primary" htmlType="submit">
                                    Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    ),
                },
            ]}
        />
    )
}

export default Profile
