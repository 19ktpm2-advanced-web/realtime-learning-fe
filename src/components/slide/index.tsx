/* eslint-disable */
import { MessageOutlined } from '@ant-design/icons'
import { Badge } from 'antd'
import { IOption, ISlide } from 'interfaces'
import { useEffect, useState, memo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { IMessage } from '../../interfaces/message'
import { SocketContext } from '../../service'
import { ChatEvent, PresentationEvent } from '../../service/socket/event'
import { generatePresentationLink } from '../../utils/presentation.util'
import AnswerChart from '../answer-chart'
import ChatBox from '../chat-box'
import { failureModal } from '../modals'
import publicInstance from '../../service/axiosPublic'
import styles from './style.module.css'

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
    const [messages, setMessages] = useState<IMessage[]>([])

    useEffect(() => {
        if (slide?.optionList) {
            setOptionData(slide.optionList)
        }
    }, [slide])

    useEffect(() => {
        publicInstance
            .get(`/presentation/chat/messages/${code}`)
            .then((res) => {
                if (res?.status === 200) {
                    setMessages(res.data)
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
            })
            .catch((error) => {
                failureModal('Something is wrong', error.response && error.response.data)
            })
    }, [])

    const handleUpdateResults = (result: { slide: ISlide }) => {
        setOptionData(result.slide.optionList || [])
    }

    const handleIncomingMessage = (newMessage: IMessage) => {
        setMessages((messages) => [...messages, newMessage])
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

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socketService.socket.removeAllListeners()
            socketService.disconnect()
        }
    }, [socketService.socket])

    return (
        <div className={styles.slideContainer}>
            <div className={styles.invitationWrapper}>
                {slide.optionList && slide.optionList.length > 0 && isFullScreen ? (
                    <p>
                        Share link:{' '}
                        <Link to={`/answer-form/${code}`}>{generatePresentationLink(code)}</Link>
                    </p>
                ) : (
                    <></>
                )}
            </div>
            <div className={styles.questionWrapper}>
                <h2>{slide.text}</h2>
            </div>
            <div className={styles.chartWrapper}>
                {slide.optionList && slide.optionList.length > 0 ? (
                    <AnswerChart options={optionData} />
                ) : (
                    <></>
                )}
            </div>
            <div className={styles.footer}>
                <Badge count={5} color="#1857cf" className={styles.messageIcon} size="small">
                    <MessageOutlined onClick={() => setChatBoxIsOpen(true)} />
                </Badge>
            </div>
            <ChatBox
                isOpen={chatBoxIsOpen}
                handleVisible={setChatBoxIsOpen}
                messages={messages}
                presentationCode={code}
            />
        </div>
    )
}

export default memo(Slide)
