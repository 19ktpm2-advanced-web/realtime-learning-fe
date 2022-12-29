/* eslint-disable */
// @ts-nocheck
import { useForm, Controller } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MailOutlined } from '@ant-design/icons'
import { Input, Spin } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import { failureModal, successModal } from '../../components/modals'
import './index.css'
import forgotValidationSchema from './validation/forgot-password.schema'
import instance from 'service/axiosPublic'
import { useEffect } from 'react'

function ForgotPassword() {
    const navigate = useNavigate()
    const { state } = useLocation()

    useEffect(() => {
        if (localStorage.getItem('session')) {
            navigate('/')
        }
    }, [localStorage.getItem('session')])

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(forgotValidationSchema),
    })

    const onSubmit = (value) => {
        mutate(value, {
            onSuccess: (res) => {
                if (res.status === 200) {
                    successModal(
                        'Reset password successfully',
                        'Please check your email for the reset password',
                    )
                    navigate('/login', {
                        state,
                    })
                } else failureModal('Reset password failed', res.message)
            },
            onError: (error) => {
                failureModal('Reset password failed', error.response && error.response.data)
            },
        })
    }

    const { mutate, isLoading } = useMutation((forgotPasswordFormData) => {
        return instance.post('/auth/forgot-password', forgotPasswordFormData)
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="formWrapper">
            <p className="title">Reset Password</p>
            <div className="inputWrapper">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            className="input"
                            placeholder="Enter your email"
                            size="large"
                            suffix={<MailOutlined />}
                        />
                    )}
                />
                <span className="message">{errors?.email?.message}</span>
            </div>
            <div className="btnWrapper">
                <Spin spinning={isLoading}>
                    <button type="submit" className="button">
                        Reset password
                    </button>
                </Spin>
                {/* eslint-disable-next-line no-use-before-define */}
            </div>
            <br />
            <Link to="/login" state={state} type="submit">
                Back to login
            </Link>
        </form>
    )
}
export default ForgotPassword
