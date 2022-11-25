/* eslint-disable */
// @ts-nocheck
import { useForm, Controller } from 'react-hook-form'
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input, Spin } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import { config } from '../../config'
import { failureModal, successModal } from '../../components/modals'
import './index.css'
import instance from 'service/axiosPublic'
import registerValidationSchema from './validation/register.schema'

function Register() {
    const navigate = useNavigate()
    const { state } = useLocation()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerValidationSchema),
    })

    const { mutate, isLoading } = useMutation((registerFormData) => {
        return instance.post('/auth/register', registerFormData)
    })

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: (data) => {
                if (data?.status === 200) {
                    successModal('Register successfully', `Welcome ${data?.data?.fullName}`)
                    navigate('/login', { state })
                } else {
                    failureModal('Register failed', data.message)
                }
            },
            onError: (error) => {
                failureModal('Register failed', error.response && error.response.data)
            },
        })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="formWrapper">
            <p className="title">Register Your Information</p>
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
                            prefix={<MailOutlined />}
                        />
                    )}
                />
                <span className="message">{errors?.email?.message}</span>
            </div>
            <div className="inputWrapper">
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            className="input"
                            placeholder="Enter your name"
                            size="large"
                            prefix={<UserOutlined />}
                        />
                    )}
                />
                <span className="message">{errors?.fullName?.message}</span>
            </div>
            <div className="inputWrapper">
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            className="input"
                            {...field}
                            placeholder="Enter password"
                            size="large"
                            iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                        />
                    )}
                />
                <span className="message">{errors?.password?.message}</span>
            </div>
            <div className="btnWrapper">
                <Spin spinning={isLoading}>
                    <button type="submit" className="button">
                        Register
                    </button>
                </Spin>
                <Link to="/login" state={state} className="button">
                    Login
                </Link>
            </div>
        </form>
    )
}
export default Register
