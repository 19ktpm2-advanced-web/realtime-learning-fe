/* eslint-disable */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'
import instance from 'service/axiosPublic'
import { failureModal, successModal } from 'components/modals'

function Activation() {
    const navigate = useNavigate()
    const { emailToken } = useParams()
    const [token, setToken] = useState(emailToken)
    const [verified, setVerified] = useState(false)
    const [unknowError, setUnknownError] = useState('')

    useEffect(() => {
        instance
            .get(`/auth/verify-email/${token}`)
            .then((res) => {
                setVerified(true)
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) setUnknownError(err.response.data)
                setVerified(false)
            })
    }, [token])
    function handleResendVerificationMail() {
        instance
            .post(`/auth/resend-verification-mail/`, { token: token })
            .then((res) => {
                setToken(res.data.emailToken)
                successModal('Email sent', `Please check your inbox for the verification email`)
            })
            .catch((err) => {
                failureModal('System error', err.response ? err.response.data : err.message)
            })
    }

    return (
        <div>
            {verified ? (
                <Result
                    status="success"
                    title="Your account verified Successfully "
                    extra={[
                        <>
                            {localStorage.getItem('session') ? (
                                <Button
                                    type="primary"
                                    key="console"
                                    onClick={() => {
                                        navigate('/')
                                    }}
                                >
                                    Home
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    key="console"
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                >
                                    Login
                                </Button>
                            )}
                        </>,
                    ]}
                />
            ) : (
                <>
                    {unknowError ? (
                        <Result status="warning" title={unknowError} />
                    ) : (
                        <Result
                            status="warning"
                            title="There are some problems with your operation."
                            subTitle="Please try again or click the button below to resend new verification mail"
                            extra={
                                <Button
                                    type="primary"
                                    key="console"
                                    onClick={handleResendVerificationMail}
                                >
                                    Resend
                                </Button>
                            }
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default Activation
