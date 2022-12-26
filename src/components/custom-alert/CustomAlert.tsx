import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function CustomAlert({
    toastId,
    content,
    visible = false,
}: {
    toastId?: string
    content: {
        title?: string
        text?: string
    }
    visible: boolean
}): JSX.Element {
    useEffect(() => {
        if (visible && content) {
            toast(
                <div>
                    <div>{content.title}</div>
                    <div>{content.text}</div>
                </div>,
                {
                    toastId,
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                },
            )
        }
    }, [content, visible])

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
            theme="light"
        />
    )
}
export default CustomAlert
