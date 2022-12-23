import { useContext, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import MessageNotification from 'components/message-notification'
import Slide from 'components/slide'
import LoadingSpin from '../../components/loading-spin'
import { failureModal } from '../../components/modals'
import { IMultipleChoiceSlide } from '../../interfaces'
import { IMessage } from '../../interfaces/message'
import { SocketContext } from '../../service'
import publicInstance from '../../service/axiosPublic'
import { ChatEvent, PresentationEvent } from '../../service/socket/event'

function Present() {
    const navigate = useNavigate()
    const socketService = useContext(SocketContext)
    const {
        presentationCode,
    }: {
        presentationCode: string
    } = useLoaderData() as any
    const [slide, setSlide] = useState<IMultipleChoiceSlide>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [comingMessage, setComingMessage] = useState<IMessage | null>(null)

    const handleIncomingMessage = (newMessage: IMessage) => {
        setShowNotification(true)
        setComingMessage(newMessage)
    }

    useEffect(() => {
        if (presentationCode) {
            setIsLoading(true)
            publicInstance
                .get(`/presentation/slide/get/${presentationCode}`)
                .then((res) => {
                    setIsLoading(false)
                    if (res?.status === 200) {
                        setSlide(res.data)
                    } else {
                        navigate('/404')
                    }
                })
                .catch(() => {
                    navigate('/404')
                })
        }
    }, [presentationCode])

    useEffect(() => {
        try {
            socketService.establishConnection()
        } catch (error) {
            failureModal(
                'Something is wrong with the socket! Please try to reload the page.',
                error,
            )
        }

        // Each user watching the same presentation will join the same room
        socketService.socket.emit(PresentationEvent.JOIN_ROOM, {
            roomId: presentationCode,
        })

        socketService.socket.on(PresentationEvent.END_PRESENTING, () => {
            navigate('/404')
        })

        socketService.socket.on(ChatEvent.NEW_CHAT_MESSAGE, handleIncomingMessage)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socketService.socket.removeAllListeners()
            socketService.disconnect()
        }
    }, [socketService.socket])

    return (
        <>
            <MessageNotification visible={showNotification} message={comingMessage} />
            {isLoading ? (
                <LoadingSpin />
            ) : (
                <Slide slide={slide} code={presentationCode} isFullScreen />
            )}
        </>
    )
}

export default Present
