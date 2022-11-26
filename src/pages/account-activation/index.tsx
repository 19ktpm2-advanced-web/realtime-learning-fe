/* eslint-disable */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'
import instance from 'service/axiosPrivate'
import { failureModal, successModal } from 'components/modals'

function Activation() {
    const navigate = useNavigate()
    const { emailToken } = useParams()
    const [token, setToken] = useState(emailToken)
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        instance
            .get(`auth/verify-email/${emailToken}`)
            .then((res) => {
                setVerified(true)
            })
            .catch((err) => {
                setVerified(false)
            })
    }, [])
    function handleResendVerificationMail() {
        instance
            .post(`auth/resend-verification-mail/`, { token: token })
            .then((res) => {
                setToken(res.data.emailToken)
                successModal('Email sent', `Please check your inbox for lastest verification email`)
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
                        <Button
                            type="primary"
                            key="console"
                            onClick={() => {
                                navigate('/login')
                            }}
                        >
                            Login
                        </Button>,
                    ]}
                />
            ) : (
                <Result
                    status="warning"
                    title="There are some problems with your operation."
                    subTitle="Please try again or click the button below to resend new verification mail"
                    extra={
                        <Button type="primary" key="console" onClick={handleResendVerificationMail}>
                            Resend
                        </Button>
                    }
                />
            )}
        </div>
    )
}

export default Activation
