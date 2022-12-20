/* eslint-disable */

import { Button, Form, List, Modal, Tabs } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useEffect, useState } from 'react'
// import { MessageBox } from 'react-chat-elements'
import InfiniteScroll from 'react-infinite-scroller'
import { failureModal } from 'components/modals'
// RCE CSS
import 'react-chat-elements/dist/main.css'
import { useMutation } from 'react-query'
import { IMessage } from '../../interfaces/message'
import { IQnAQuestion } from '../../interfaces/qnaQuestion'
import publicInstance from '../../service/axiosPublic'
import privateInstance from '../../service/axiosPrivate'
import styles from './style.module.css'

const PAGE_SIZE = 20
const sampleQuestionList: IQnAQuestion[] = [
    {
        id: '1',
        question: 'fwfe',
        likeCount: 1,
        isAnswered: false,
    },
    {
        id: '2',
        question: 'fefwef',
        likeCount: 2,
        isAnswered: false,
    },
    {
        id: '3',
        question: 'fwef',
        likeCount: 4,
        isAnswered: true,
    },
    {
        id: '4',
        question: '234fwewe24',
        likeCount: 4,
        isAnswered: true,
    },
    {
        id: '5',
        question: 'fwef',
        likeCount: 4,
        isAnswered: true,
    },
    {
        id: '6',
        question: 'fewffewf',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '7',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '8',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '9',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '10',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '11',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '12',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '13',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '14',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '15',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
    {
        id: '16',
        question: 'fwef',
        likeCount: 4,
        isAnswered: false,
    },
]
function QnA({
    isOpen,
    handleVisible,
    presentationCode,
    comingMessage,
}: {
    isOpen: boolean
    handleVisible: (isVisible: boolean) => void
    presentationCode: string
    comingMessage: IMessage | null
}) {
    const [questionList, setQuestionList] = useState<IQnAQuestion[]>([])
    const [hashMore, setHasMore] = useState(true)
    const [form] = Form.useForm()
    const fetchMessages = async (pageNumber: number) => {
        try {
            const res = await publicInstance.get(
                `/presentation/chat/messages/${presentationCode}?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
            )
            if (res?.status === 200) {
                res.data.reverse()
                setQuestionList((prev) => [...res.data, ...prev])
                if (res.data.length <= 0) {
                    setHasMore(false)
                }
            } else {
                failureModal('Something is wrong', res.statusText)
            }
        } catch (error) {
            failureModal('Something is wrong', error.response && error.response.data)
        }
    }
    useEffect(() => {
        if (!comingMessage) {
            fetchMessages(1)
            setQuestionList(sampleQuestionList)
        } else {
            // setQuestionList((prev) => [...prev, questionList])
            setQuestionList(sampleQuestionList)
            setHasMore(true)
        }
    }, [comingMessage])
    const { mutate } = useMutation((addMessageData) => {
        const profile = localStorage.getItem('profile')
        if (!profile) {
            return publicInstance.post('/presentation/chat/add-anonymous-message', addMessageData)
        }
        return privateInstance.post('/presentation/chat/add-authenticated-message', addMessageData)
    })
    const handleSubmit = (data: any) => {
        form.resetFields()

        const payload: any = {
            message: data.message,
            presentationCode,
        }

        mutate(payload)
    }
    return (
        <Modal
            title="Q&A"
            centered
            open={isOpen}
            footer={null}
            onCancel={() => handleVisible(false)}
            getContainer={false}
            bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 0,
                height: '80vh',
                maxWidth: '100%',
            }}
        >
            <div className={styles['message-list-wrapper']}>
                <Tabs
                    centered
                    tabPosition="bottom"
                    items={['Question', 'Answered'].map((text, i) => {
                        const id = String(i + 1)
                        const isAnswered = text === 'Answered'
                        return {
                            label: text,
                            key: id,
                            children: (
                                // add scroll here

                                <InfiniteScroll
                                    pageStart={0}
                                    loadMore={fetchMessages}
                                    hasMore={hashMore}
                                    loader={
                                        <div className="loader" key={0}>
                                            Loading ...
                                        </div>
                                    }
                                    useWindow={false}
                                    isReverse
                                >
                                    <List
                                        dataSource={questionList.filter(
                                            (question) => question.isAnswered === isAnswered,
                                        )}
                                        renderItem={(item) => (
                                            <List.Item key={item.id}>
                                                <List.Item.Meta
                                                    // avatar={<Avatar src={item.picture.large} />}
                                                    title={
                                                        <a href="https://ant.design">
                                                            {item.question}
                                                        </a>
                                                    }
                                                    description="Mark as answered"
                                                />
                                                <div>Content</div>
                                            </List.Item>
                                        )}
                                    />
                                </InfiniteScroll>
                            ),

                            // add end here
                        }
                    })}
                />
            </div>

            <Form onFinish={handleSubmit} className={styles.form} form={form}>
                <Form.Item name="message" noStyle>
                    <div className={styles['chat-area']}>
                        <TextArea
                            className={styles['chat-input']}
                            placeholder="Type here..."
                            autoSize={false}
                        />
                    </div>
                </Form.Item>

                <Form.Item noStyle>
                    <div className={styles['submit-btn-wrapper']}>
                        <Button className={styles['submit-btn']} type="primary" htmlType="submit">
                            Send
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default QnA
