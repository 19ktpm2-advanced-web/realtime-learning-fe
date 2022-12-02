/* eslint-disable */
import { Button, Card, Divider, Form, Radio, Space } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useLoaderData } from 'react-router-dom'
import AnswerChart from '../../components/answer-chart'
import { failureModal, successModal } from '../../components/modals'
import slide from '../../components/slide'
import { IOption, ISlide } from '../../interfaces'
import { SocketContext } from '../../service'
import instance from '../../service/axiosPrivate'
import { SocketEvent } from '../../service/socket/event'
import styles from './styles.module.css'

function AnswerForm() {
    const [form] = Form.useForm()
    const socket = useContext(SocketContext)
    const {
        presentationId,
        slideId,
    }: {
        presentationId: string
        slideId: string
    } = useLoaderData() as any
    const [slide, setSlide] = useState<ISlide>({})
    const [isLoading, setIsLoading] = useState(false)
    const [hasAnswered, setHasAnswered] = useState(false)

    useEffect(() => {
        socket.emit(SocketEvent.JOIN_ROOM, {
            roomId: presentationId,
        })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        instance
            .get(`/presentation/slide/get/${presentationId}&${slideId}`, {})
            .then((res) => {
                if (res?.status === 200) {
                    setSlide(res.data)
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                failureModal('Something is wrong', error.response && error.response.data)
            })
    }, [])

    useEffect(() => {
        socket.on(SocketEvent.UPDATE_RESULTS, handleUpdateResults)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.removeAllListeners()
        }
    }, [socket])

    const handleUpdateResults = (results: any) => {
        setSlide(results.slide)
    }

    const { mutate } = useMutation((updateAnswerData) => {
        return instance.post('/presentation/slide/update-answer', updateAnswerData)
    })

    const handleSubmit = (data: any) => {
        const payload: any = {
            optionId: data.answer,
            presentationId,
            slideId,
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
            {isLoading ? (
                <></>
            ) : (
                <>
                    <div className={styles['answer-chart']}>
                        <AnswerChart options={slide.optionList || []} />
                    </div>

                    <Divider type="vertical" style={{ height: '100%' }} />

                    <div className={styles['form-wrapper']}>
                        {hasAnswered ? (
                            <div className={styles['thanks-for-answering']}>
                                <h1>Thanks for answering</h1>
                            </div>
                        ) : (
                            <>
                                <div className={styles['question-wrapper']}>
                                    <h2>
                                        Are you OK? Lorem ipsum, dolor sit amet consectetur
                                        adipisicing elit. Assumenda est, illo nemo laborum dolorem
                                        alias enim unde perferendis. Magni rerum commodi itaque
                                        optio autem quas inventore vel ipsam repellendus quibusdam!
                                    </h2>
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
