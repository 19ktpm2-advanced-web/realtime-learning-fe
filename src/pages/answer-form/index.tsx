/* eslint-disable */
import { MessageOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Radio } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useLoaderData, useNavigate } from 'react-router-dom'
import AnswerChart from '../../components/answer-chart'
import ChatBox from '../../components/chat-box'
import LoadingSpin from '../../components/loading-spin'
import { failureModal } from '../../components/modals'
import { ISlide } from '../../interfaces'
import { IMessage } from '../../interfaces/message'
import { SocketContext } from '../../service'
import publicInstance from '../../service/axiosPublic'
import { ChatEvent, PresentationEvent } from '../../service/socket/event'
import MessageNotification from 'components/message-notification'
import styles from './styles.module.css'

function AnswerForm() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const socketService = useContext(SocketContext)
    const {
        presentationCode,
    }: {
        presentationCode: string
    } = useLoaderData() as any
    const [slide, setSlide] = useState<ISlide>({})
    const [isLoading, setIsLoading] = useState(false)
    const [hasAnswered, setHasAnswered] = useState(false)
    const [chatBoxIsOpen, setChatBoxIsOpen] = useState(false)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [showNotification, setShowNotification] = useState(false)
    const [comingMessage, setComingMessage] = useState<IMessage | null>(null)

    const handleIncomingMessage = (newMessage: IMessage) => {
        setShowNotification(true)
        setComingMessage(newMessage)
        setMessages((messages) => [...messages, newMessage])
    }

    useEffect(() => {
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
            .catch((error) => {
                navigate('/404')
            })
    }, [])

    useEffect(() => {
        publicInstance
            .get(`/presentation/chat/messages/${presentationCode}`)
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
        socketService.socket.on(PresentationEvent.UPDATE_RESULTS, handleUpdateResults)

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

    const handleUpdateResults = (results: any) => {
        setSlide(results.slide)
    }

    const { mutate } = useMutation((updateAnswerData) => {
        return publicInstance.post('/presentation/slide/update-answer', updateAnswerData)
    })

    const handleSubmit = (data: any) => {
        const payload: any = {
            optionId: data.answer,
            presentationCode,
        }
        setIsLoading(true)
        mutate(payload, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    setHasAnswered(true)
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
                setIsLoading(false)
            },
            onError: (error: any) => {
                setIsLoading(false)
                failureModal('Something is wrong', error.response && error.response.data)
            },
        })
    }

    return (
        <div className={styles.container}>
            <MessageNotification visible={showNotification} message={comingMessage} />
            {isLoading ? (
                <LoadingSpin />
            ) : (
                <>
                    <div className={styles['answer-chart']}>
                        <AnswerChart options={slide.optionList || []} />
                    </div>

                    <Divider type="vertical" style={{ height: '100%' }} />

                    <div className={styles['form-wrapper']}>
                        <div className={styles['header']}>
                            <MessageOutlined
                                className={styles['message-icon']}
                                onClick={() => setChatBoxIsOpen(true)}
                            />
                        </div>
                        <ChatBox
                            isOpen={chatBoxIsOpen}
                            handleVisible={setChatBoxIsOpen}
                            messages={messages}
                            presentationCode={presentationCode}
                        />
                        {hasAnswered ? (
                            <div className={styles['thanks-for-answering']}>
                                <h1>Thanks for answering</h1>
                            </div>
                        ) : (
                            <>
                                <div className={styles['question-wrapper']}>
                                    <h2>{slide.text}</h2>
                                </div>
                                <Form
                                    layout="horizontal"
                                    onFinish={handleSubmit}
                                    className={styles['form']}
                                    form={form}
                                >
                                    <Form.Item
                                        name="answer"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select an option!',
                                            },
                                        ]}
                                    >
                                        <Radio.Group className={styles['radio-group']}>
                                            {slide.optionList?.map((option, index) => {
                                                return (
                                                    <Card
                                                        key={index}
                                                        className={styles['space-radio-group']}
                                                    >
                                                        <Radio
                                                            className={styles['radio-btn']}
                                                            value={option.id}
                                                        >
                                                            {option.answer}
                                                        </Radio>
                                                    </Card>
                                                )
                                            })}
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            className={styles['submit-btn']}
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                        >
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default AnswerForm
