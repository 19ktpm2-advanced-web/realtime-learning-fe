import { failureModal, successModal } from 'components/modals'
import instance from 'service/axiosPublic'
import { Button } from 'antd'

const ResendMailSection = (email: string) => {
    const handleResend = () => {
        if (email) {
            instance
                .post('/auth/resend-mail/', email)
                .then(() => {
                    successModal('Email sent', 'Please check your inbox for the verification email')
                })
                .catch((err) => {
                    failureModal('System error', err.response ? err.response.data : err.message)
                })
        }
    }

    return (
        <div>
            <div>Haven&apos;t recieved mail?</div>
            <div className="btnWrapper">
                <Button type="primary" key="console" onClick={handleResend}>
                    Resend
                </Button>
            </div>
        </div>
    )
}

export default ResendMailSection
