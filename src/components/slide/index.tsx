import { useEffect, useState, memo, useContext } from 'react'
import { MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Badge } from 'antd'
import { IOption, ISlide } from 'interfaces'

import { Link } from 'react-router-dom'
import { IMessage } from '../../interfaces/message'
import { SocketContext } from '../../service'
import { ChatEvent, PresentationEvent, QnAEvent } from '../../service/socket/event'
import { generatePresentationLink } from '../../utils/presentation.util'
import AnswerChart from '../answer-chart'
import ChatBox from '../chat-box'
import MessageNotification from '../message-notification'
import { failureModal } from '../modals'
import styles from './style.module.css'
import QnA from '../qna-box'
import { IQnAQuestion } from '../../interfaces/qnaQuestion'

function Slide({
    slide,
    code,
    isFullScreen,
}: {
    slide: ISlide
    code: string
    isFullScreen: boolean
}) {
    const socketService = useContext(SocketContext)
    const [optionData, setOptionData] = useState<IOption[]>(slide?.optionList ?? [])
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false)
    const [QnAIsOpen, setQnAIsOpen] = useState(false)
    const [unReadMessages, setUnReadMessages] = useState(0)
    const [showNotification, setShowNotification] = useState(false)
    const [comingMessage, setComingMessage] = useState<IMessage | null>(null)
    const [comingQuestion, setComingQuestion] = useState<IQnAQuestion | null>(null)
    useEffect(() => {
        if (chatBoxIsOpen) {
            setUnReadMessages(0)
        }
    }, [chatBoxIsOpen])
    useEffect(() => {
        if (slide?.optionList) {
            setOptionData(slide.optionList)
        }
    }, [slide])

    const handleUpdateResults = (result: { slide: ISlide }) => {
        setOptionData(result.slide.optionList || [])
    }

    const handleIncomingMessage = (newMessage: IMessage) => {
        setShowNotification(true)
        setComingMessage(newMessage)
    }

    const handleIncomingQuestion = (newQuestion: IQnAQuestion) => {
        setShowNotification(true)
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
        socketService.socket.on(PresentationEvent.UPDATE_RESULTS, handleUpdateResults)
        socketService.socket.on(ChatEvent.NEW_CHAT_MESSAGE, handleIncomingMessage)
        socketService.socket.on(QnAEvent.NEW_QNA_QUESTION, handleIncomingQuestion)
        socketService.socket.on(QnAEvent.UPDATE_QNA_QUESTION, handleIncomingQuestion)
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
                    {slide.optionList && slide.optionList.length > 0 && isFullScreen && (
                        <p>
                            Share link:{' '}
                            <Link to={`/answer-form/${code}`}>
                                {generatePresentationLink(code)}
                            </Link>
                        </p>
                    )}
                </div>
                <div className={styles.questionWrapper}>
                    <h2>{slide.text}</h2>
                </div>
                <div className={styles.chartWrapper}>
                    {slide.optionList && slide.optionList.length > 0 && (
                        <AnswerChart options={optionData} />
                    )}
                </div>
                <div className={styles.footer}>
                    <Badge
                        count={unReadMessages}
                        color="#1857cf"
                        className={styles.messageIcon}
                        size="small"
                    >
                        <QuestionCircleOutlined onClick={() => setQnAIsOpen(true)} />
                    </Badge>
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

                <QnA
                    isOpen={QnAIsOpen}
                    handleVisible={setQnAIsOpen}
                    presentationCode={code}
                    comingQuestion={comingQuestion}
                    isHideInput
                />
            </div>
        </>
    )
}

export default memo(Slide)
