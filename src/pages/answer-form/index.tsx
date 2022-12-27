/* eslint-disable */
import { Button, Card, Divider, Form, Radio } from 'antd'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { useLoaderData, useNavigate } from 'react-router-dom'
import LoadingSpin from '../../components/loading-spin'
import { failureModal } from '../../components/modals'
import { IMultipleChoiceSlide, IOption } from '../../interfaces'
import publicInstance from '../../service/axiosPublic'
import styles from './styles.module.css'
import Slide from 'components/slide'

function AnswerForm({
    slide,
    handleUpdateResults,
    handlePresentingSlideChanged,
}: {
    slide: IMultipleChoiceSlide
    handleUpdateResults: (result: any) => void
    handlePresentingSlideChanged: () => void
}) {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const {
        presentationCode,
    }: {
        presentationCode: string
    } = useLoaderData() as any
    const [isLoading, setIsLoading] = useState(false)
    const [hasAnswered, setHasAnswered] = useState(false)
    const { mutate } = useMutation((updateAnswerData) => {
        return publicInstance.post('/presentation/slide/update-answer', updateAnswerData)
    })

    const handleSubmit = (data: any) => {
        const payload: any = {
            optionId: data.answer,
            presentationCode,
        }
        // setIsLoading(true)
        mutate(payload, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    setHasAnswered(true)
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
            },
            onError: (error: any) => {
                // setIsLoading(false)
                failureModal('Something is wrong', error.response && error.response.data)
            },
        })
    }

    return (
        <div className={styles.container}>
            {isLoading ? (
                <LoadingSpin />
            ) : (
                <>
                    <div className={styles['answer-chart']}>
                        <Slide
                            slide={slide}
                            code={presentationCode}
                            isFullScreen={false}
                            groupId={''}
                            handleEndPresent={() => {
                                navigate('/404')
                            }}
                            handleUpdateResults={handleUpdateResults}
                            handlePresentingSlideChanged={handlePresentingSlideChanged}
                            isPresenterRole={false}
                        />
                    </div>

                    <Divider type="vertical" style={{ height: '100%' }} />

                    <div className={styles['form-wrapper']}>
                        {hasAnswered ? (
                            <div className={styles['thanks-for-answering']}>
                                <h1>Thanks for answering</h1>
                            </div>
                        ) : (
                            <>
                                <div className={styles['qnaQuestion-wrapper']}>
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
