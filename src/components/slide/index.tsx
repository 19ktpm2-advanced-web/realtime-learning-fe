import { useEffect, useState, memo, useContext } from 'react'
import { MessageOutlined } from '@ant-design/icons'
import { Badge } from 'antd'
import { ISlide } from 'interfaces'

import { Link } from 'react-router-dom'
import { IMessage } from '../../interfaces/message'
import { SocketContext } from '../../service'
import { ChatEvent, PresentationEvent } from '../../service/socket/event'
import { generatePresentationLink } from '../../utils/presentation.util'
import ChatBox from '../chat-box'
import MessageNotification from '../message-notification'
import SlideContent from '../slideContent'
import { failureModal } from '../modals'
import styles from './style.module.css'

function Slide({
    slide,
    code,
    isFullScreen,
    visibleChat = true,
}: {
    slide: ISlide
    code: string
    isFullScreen: boolean
    visibleChat?: boolean
}) {
    const socketService = useContext(SocketContext)
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false)
    const [unReadMessages, setUnReadMessages] = useState(0)
    const [showNotification, setShowNotification] = useState(false)
    const [comingMessage, setComingMessage] = useState<IMessage | null>(null)
    useEffect(() => {
        if (chatBoxIsOpen) {
            setUnReadMessages(0)
        }
    }, [chatBoxIsOpen])

    const handleIncomingMessage = (newMessage: IMessage) => {
        setShowNotification(true)
        setComingMessage(newMessage)
    }

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
            roomId: code,
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
            <div className={styles.slideContainer}>
                <div className={styles.invitationWrapper}>
                    {isFullScreen && (
                        <p>
                            Share link:{' '}
                            <Link to={`/answer-form/${code}`}>
                                {generatePresentationLink(code)}
                            </Link>
                        </p>
                    )}
                </div>
                <SlideContent slide={slide} />
                {visibleChat && (
                    <>
                        <div className={styles.footer}>
                            <Badge
                                count={unReadMessages}
                                color="#1857cf"
                                className={styles.messageIcon}
                                size="small"
                            >
                                <MessageOutlined onClick={() => setChatBoxIsOpen(true)} />
                            </Badge>
                        </div>
                        <ChatBox
                            isOpen={chatBoxIsOpen}
                            handleVisible={setChatBoxIsOpen}
                            presentationCode={code}
                            comingMessage={comingMessage}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default memo(Slide)
