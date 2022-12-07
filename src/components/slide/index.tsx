import React, { useMemo, useEffect, useState, memo, useContext } from 'react'
import { MessageOutlined } from '@ant-design/icons'
import { Badge, notification } from 'antd'
import { IOption, ISlide } from 'interfaces'

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

const Context = React.createContext({ name: 'Default' })

function Slide({
    slide,
    code,
    isFullScreen,
}: {
    slide: ISlide
    code: string
    isFullScreen: boolean
}) {
    const [api, contextHolder] = notification.useNotification()
    const socketService = useContext(SocketContext)
    const [optionData, setOptionData] = useState<IOption[]>(slide?.optionList ?? [])
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [unReadMessages, setUnReadMessages] = useState(0)
    async function openNewMessageNotification(message: IMessage) {
        if (chatBoxIsOpen) return
        const profile = await localStorage.getItem('profile')
        if (profile && JSON.parse(profile)?.fullName === message.title) return
        api.info({
            message: `From: ${message.title}`,
            description: message.text,
            placement: 'bottomRight',
            duration: 2,
        })
    }
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), [])
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

    useEffect(() => {
        publicInstance
            .get(`/presentation/chat/messages/${code}`)
            .then((res) => {
                if (res?.status === 200) {
                    setMessages(res.data)
                    setUnReadMessages(res.data.length)
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
        openNewMessageNotification(newMessage)
        setMessages((prev) => [...prev, newMessage])
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
        <Context.Provider value={contextValue}>
            {contextHolder}
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
        </Context.Provider>
    )
}

export default memo(Slide)
