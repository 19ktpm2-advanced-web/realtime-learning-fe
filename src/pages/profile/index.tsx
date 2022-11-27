/* eslint-disable */
import { LoadingOutlined } from '@ant-design/icons'
import { Form, Input, Radio, DatePicker, Tabs, Button, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import { failureModal, successModal } from '../../components/modals'
import UploadAvatar from '../../components/upload-avatar'
import { IUser } from '../../interfaces'
import dayjs from '../../utils/dayjs.util'
import './index.css'

function Profile() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<IUser>()
    const [form] = Form.useForm()

    useQuery(['profile'], async () => {
        try {
            const res = await instance.get('/user/profile')

            setProfile({
                ...res.data,
                dateOfBirth: dayjs(res.data.dateOfBirth),
            })
            form.setFieldsValue({
                ...res.data,
                dateOfBirth: dayjs(res.data.dateOfBirth),
            })
            setIsLoading(false)
            return res.data
        } catch (error) {
            failureModal('Failed to get profile')
            setIsLoading(false)
        }
    })

    useEffect(() => {
        if (!localStorage.getItem('session')) navigate('/login')
    }, [localStorage.getItem('session')])

    const { mutate } = useMutation((updateProfileData) => {
        return instance.post('/user/update-profile', updateProfileData)
    })

    const handleSubmit = (data: any) => {
        setIsLoading(true)
        mutate(data, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    successModal('Update profile successfully')
                } else {
                    failureModal('Update profile failed', res.statusText)
                }
                setIsLoading(false)
            },
            onError: (error: any) => {
                setIsLoading(false)
                failureModal('Update profile failed', error.response && error.response.data)
            },
        })
    }

    const { mutate: passwordMutate } = useMutation((updatePasswordData) => {
        return instance.post('/user/update-password', updatePasswordData)
    })

    const handlePasswordSubmit = (data: any) => {
        form.resetFields()
        const transformedData: any = {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
        }
        passwordMutate(transformedData, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    successModal('Update password successfully')
                } else {
                    failureModal('Update password failed', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Update password failed', error.response && error.response.data)
            },
        })
    }

    const { mutate: verifyEmailMutate } = useMutation((verifyEmailData) => {
        return instance.post('/auth/resend-mail', verifyEmailData)
    })

    const handleVerifyEmail = (data: any) => {
        verifyEmailMutate(data, {
            onSuccess: (res) => {
                if (res?.status === 204) {
                    successModal('Email sent', 'Please check your inbox for the verification email')
                } else {
                    failureModal('Failed to send verification email!', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal(
                    'Failed to send verification email! Please try again later',
                    error.response && error.response.data,
                )
            },
        })
    }

    return (
        <>
            {isLoading ? (
                <div className="loading-spin-wrapper">
                    <Spin indicator={<LoadingOutlined />} />
                </div>
            ) : (
                <div>
                    <Tabs
                        centered
                        defaultActiveKey="1"
                        items={[
                            {
                                label: 'Profile',
                                key: '1',
                                children: (
                                    <Form
                                        form={form}
                                        onFinish={handleSubmit}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                        layout="horizontal"
                                        className="form-wrapper"
                                    >
                                        <Form.Item label="Avatar" name="avatar">
                                            <UploadAvatar formRef={form} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'This field cannot be empty!',
                                                },
                                            ]}
                                            style={
                                                profile?.isVerified ? {} : { marginBottom: '10px' }
                                            }
                                        >
                                            <Input placeholder="Ex: abc@gmail.com" disabled />
                                        </Form.Item>
                                        {profile?.isVerified ? (
                                            <></>
                                        ) : (
                                            <Form.Item
                                                wrapperCol={{ span: 10, offset: 4 }}
                                                className="verify-email-btn"
                                            >
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        handleVerifyEmail({
                                                            email: form.getFieldValue('email'),
                                                        })
                                                    }}
                                                >
                                                    Verify email
                                                </Button>
                                            </Form.Item>
                                        )}

                                        <Form.Item
                                            label="Full name"
                                            name="fullName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'This field cannot be empty!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Ex: John Smith" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Phone number"
                                            name="phoneNumber"
                                            rules={[
                                                {
                                                    len: 10,
                                                    message: 'Phone number must include 10 numbers',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Ex: 0123456789" />
                                        </Form.Item>
                                        <Form.Item label="Gender" name="gender">
                                            <Radio.Group>
                                                <Radio value="male"> Male </Radio>
                                                <Radio value="female"> Female </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="Date of birth" name="dateOfBirth">
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
                                    <Form
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                        layout="horizontal"
                                        className="form-wrapper"
                                        onFinish={handlePasswordSubmit}
                                        initialValues={{
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: '',
                                        }}
                                        form={form}
                                    >
                                        <Form.Item
                                            label="Current password"
                                            name="currentPassword"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your current password!',
                                                },
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                        <Form.Item
                                            label="New password"
                                            name="newPassword"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your new password!',
                                                },
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                        <Form.Item
                                            label="Confirm password"
                                            name="confirmPassword"
                                            dependencies={['newPassword']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please confirm your password!',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (
                                                            !value ||
                                                            getFieldValue('newPassword') === value
                                                        ) {
                                                            return Promise.resolve()
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                'The confirm password that you entered do not match!',
                                                            ),
                                                        )
                                                    },
                                                }),
                                            ]}
                                        >
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
                </div>
            )}
        </>
    )
}

export default Profile
