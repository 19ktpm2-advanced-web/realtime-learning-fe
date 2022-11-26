/* eslint-disable */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'
import instance from 'service/axiosPrivate'

function Activation() {
    const navigate = useNavigate()
    const { token } = useParams()
    const [verified, setVerified] = useState(true)

    useEffect(() => {
        instance
            .get(`auth/verify-email/${token}`)
            .then((res) => {
                setVerified(true)
            })
            .catch((err) => {
                setVerified(false)
            })
    })

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
                    extra={
                        <Button type="primary" key="console">
                            Go Console
                        </Button>
                    }
                />
            )}
        </div>
    )
}

export default Activation
