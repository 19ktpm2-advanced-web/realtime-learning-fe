import { IMessage } from 'interfaces/message'
import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MessageNotification({
    message,
    visible = false,
}: {
    message: IMessage | null
    visible: boolean
}): JSX.Element {
    useEffect(() => {
        if (visible && message) {
            const profileJSON = localStorage.getItem('profile')
            const profile = profileJSON ? JSON.parse(profileJSON) : null
            if (profile && profile.fullName === message.title) return
            toast(
                <div>
                    <div>{message.title}</div>
                    <div>{message.text}</div>
                </div>,
                {
                    toastId: message?.date?.toString(),
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                },
            )
        }
    }, [message, visible])

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="dark"
        />
    )
}
export default MessageNotification
