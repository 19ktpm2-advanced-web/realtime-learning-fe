/* eslint-disable */
import { useEffect, useState, memo, useContext } from 'react'
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    MessageOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons'
import { Badge } from 'antd'
import { IMultipleChoiceSlide, ISlide } from 'interfaces'
import { Link } from 'react-router-dom'
import QuestionNotification from '../question-notification'
import { SocketContext } from '../../service'
import { ChatEvent, PresentationEvent, QnAEvent } from '../../service/socket/event'
import { generatePresentationLink } from '../../utils/presentation.util'
import ChatBox from '../chat-box'
import MessageNotification from '../message-notification'
import SlideContent from '../slideContent'
import { failureModal } from '../modals'
import styles from './style.module.css'
import QnA from '../qna-box'
import { IQnAQuestion } from '../../interfaces/qnaQuestion'

import { IMessage } from '../../interfaces/message'

function Slide({
    slide,
    code,
    isFullScreen,
    visibleChat = true,
    groupId,
    handleEndPresent,
    onPresentingSlideChanged,
    isFirstSlide,
    isLastSlide,
    handlePresentingSlideChanged,
    handleUpdateResults,
    isPresenterRole = true,
}: {
    slide: ISlide
    code: string
    isFullScreen: boolean
    visibleChat?: boolean
    groupId?: string
    handleEndPresent?: () => void
    onPresentingSlideChanged?: (moveToNextSlide: boolean) => void
    isFirstSlide?: boolean
    isLastSlide?: boolean
    handlePresentingSlideChanged?: () => void
    handleUpdateResults?: (result: { slide: IMultipleChoiceSlide }) => void
    isPresenterRole?: boolean
}) {
    const socketService = useContext(SocketContext)
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false)
    const [QnAIsOpen, setQnAIsOpen] = useState(false)
    const [unReadMessages, setUnReadMessages] = useState(0)
    const [showNotification, setShowNotification] = useState(false)
    const [showQuestionNotification, setShowQuestionNotification] = useState(false)
    const [comingMessage, setComingMessage] = useState<IMessage | null>(null)
    const [presentationPath, setPresentationPath] = useState('')
    const [presentationLink, setPresentationLink] = useState('')
    const [comingQuestion, setComingQuestion] = useState<IQnAQuestion | null>(null)
    useEffect(() => {
        if (chatBoxIsOpen) {
            setUnReadMessages(0)
        }
    }, [chatBoxIsOpen])

    const handleIncomingMessage = (newMessage: IMessage) => {
        setShowNotification(true)
        setComingMessage(newMessage)
    }

    const handleIncomingQuestion = (newQuestion: IQnAQuestion) => {
        console.log('newQuestion: ', newQuestion)
        setShowQuestionNotification(true)
        setComingQuestion(newQuestion)
    }
    const handleUpdateQuestion = (newQuestion: IQnAQuestion) => {
        console.log('updateQuestion: ', newQuestion)
        setShowQuestionNotification(false)
        setComingQuestion(newQuestion)
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

        socketService.socket.on(PresentationEvent.END_PRESENTING, () => {
            if (handleEndPresent) {
                handleEndPresent()
            }
        })

        socketService.socket.on(QnAEvent.NEW_QNA_QUESTION, handleIncomingQuestion)
        socketService.socket.on(QnAEvent.UPDATE_QNA_QUESTION, handleUpdateQuestion)
        if (handlePresentingSlideChanged)
            socketService.socket.on(
                PresentationEvent.PRESENTING_SLIDE_CHANGED,
                handlePresentingSlideChanged,
            )

        if (handleUpdateResults) {
            socketService.socket.on(PresentationEvent.UPDATE_RESULTS, handleUpdateResults)
        }

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socketService.socket.removeAllListeners()
            socketService.disconnect()
        }
    }, [socketService.socket])

    useEffect(() => {
        if (code) {
            const { url, path } = generatePresentationLink(code, slide.type, groupId)
            setPresentationPath(path)
            setPresentationLink(url)
        }
    }, [code, groupId])

    return (
        <>
            <MessageNotification visible={showNotification} message={comingMessage} />
            <QuestionNotification visible={showQuestionNotification} question={comingQuestion} />
            <div className={styles.slideContainer}>
                <div className={styles.invitationWrapper}>
                    {isFullScreen && (
                        <p>
                            Share link: <Link to={presentationPath}>{presentationLink}</Link>
                        </p>
                    )}
                </div>
                <SlideContent slide={slide} />
                {visibleChat && (
                    <>
                        <div className={styles.footer}>
                            {onPresentingSlideChanged ? (
                                <div className={styles.arrowWrapper}>
                                    <ArrowLeftOutlined
                                        className={styles.arrow}
                                        onClick={() => onPresentingSlideChanged(false)}
                                        disabled={isFirstSlide}
                                        style={isFirstSlide ? { color: '#a9a7a7' } : {}}
                                    />
                                    <ArrowRightOutlined
                                        className={styles.arrow}
                                        onClick={() => onPresentingSlideChanged(true)}
                                        disabled={isLastSlide}
                                        style={isLastSlide ? { color: '#a9a7a7' } : {}}
                                    />
                                </div>
                            ) : null}
                            <div>
                                <Badge
                                    count={unReadMessages}
                                    color="#1857cf"
                                    className={styles.messageIcon}
                                    size="small"
                                >
                                    <MessageOutlined onClick={() => setChatBoxIsOpen(true)} />
                                </Badge>
                                <Badge
                                    count={unReadMessages}
                                    color="#1857cf"
                                    className={styles.messageIcon}
                                    size="small"
                                >
                                    <QuestionCircleOutlined onClick={() => setQnAIsOpen(true)} />
                                </Badge>
                            </div>
                        </div>
                        {chatBoxIsOpen && (
                            <ChatBox
                                isOpen={chatBoxIsOpen}
                                handleVisible={setChatBoxIsOpen}
                                presentationCode={code}
                                comingMessage={comingMessage}
                            />
                        )}
                        <QnA
                            isOpen={QnAIsOpen}
                            handleVisible={setQnAIsOpen}
                            presentationCode={code}
                            comingQuestion={comingQuestion}
                            isPresenterRole={isPresenterRole}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default memo(Slide)
