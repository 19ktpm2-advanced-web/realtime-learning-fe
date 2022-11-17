import { useForm, Controller, FieldErrorsImpl } from 'react-hook-form'
import { UserOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Spin } from 'antd'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import constants from '../../constants'
import styles from './styles.module.scss'
import { failureModal, successModal } from '../../modals'
import { registerSchema } from '../../helpers/validate'
import EyeIcon from '../../icons/EyeIcon'

type RegisterFormValues = {
    fullName: string
    email: string
    password: string
}
type Error = {
    message: string
}
type ErrorSchema = Record<string, string>
function Register() {
    const navigate = useNavigate()
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    })
    const errorSchema = errors as Partial<FieldErrorsImpl<ErrorSchema>>
    const mutation = useMutation((data: RegisterFormValues) => {
        const { fullName, email, password } = data
        return fetch(`${constants.apiConfig.DOMAIN_NAME}${constants.apiConfig.ENDPOINT.register}`, {
            method: constants.apiConfig.methods.post,
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, password }),
        }).then((response) => {
            return response.json()
        })
    })
    const onSubmit = (data: RegisterFormValues) => {
        mutation.mutate(data, {
            onSuccess: (successResult) => {
                if (successResult?.code === 200 && successResult?.data?.session) {
                    localStorage.setItem('session', JSON.stringify(successResult?.data?.session ?? ''))
                    successModal('Register successfully', `Welcome ${successResult?.data?.fullName}`)
                    navigate('/')
                } else {
                    failureModal('Register failed', successResult.message)
                }
            },
            onError: (error: Error) => {
                failureModal('Register failed', error?.message)
            },
        })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
            <p className={styles.title}>Register Your Information</p>
            <div className={styles.inputWrapper}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                        <Input
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            name={name}
                            ref={ref}
                            className={styles.input}
                            placeholder="Enter your email"
                            size="large"
                            prefix={<MailOutlined />}
                        />
                    )}
                />
                <span className={styles.message}>{errorSchema?.email?.message?.toString() ?? ''}</span>
            </div>
            <div className={styles.inputWrapper}>
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                        <Input
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            name={name}
                            ref={ref}
                            className={styles.input}
                            placeholder="Enter your name"
                            size="large"
                            prefix={<UserOutlined />}
                        />
                    )}
                />
                <span className={styles.message}>{errorSchema?.fullName?.message}</span>
            </div>
            <div className={styles.inputWrapper}>
                <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                        <Input.Password
                            className={styles.input}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            name={name}
                            ref={ref}
                            placeholder="Enter password"
                            size="large"
                            iconRender={EyeIcon}
                        />
                    )}
                />
                <span className={styles.message}>{errorSchema?.password?.message}</span>
            </div>
            <div className={styles.btnWrapper}>
                <Spin spinning={mutation.isLoading}>
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                </Spin>
                <Link to="/login" className={styles.button}>
                    Login
                </Link>
            </div>
        </form>
    )
}
export default Register
