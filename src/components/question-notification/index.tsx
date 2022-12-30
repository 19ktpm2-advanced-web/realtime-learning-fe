import { IQnAQuestion } from 'interfaces/qnaQuestion'
import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function QuestionNotification({
    question,
    visible = false,
}: {
    question: IQnAQuestion | null
    visible: boolean
}): JSX.Element {
    useEffect(() => {
        if (visible && question) {
            toast(
                <div>
                    <div>New question</div>
                    <div>{question.question}</div>
                </div>,
                {
                    toastId: question?.date?.toString(),
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
    }, [question, visible])

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
export default QuestionNotification
