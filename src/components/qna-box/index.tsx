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
import { CheckOutlined, CloseOutlined, LikeOutlined } from '@ant-design/icons'

const PAGE_SIZE = 20
const sampleQuestionList: IQnAQuestion[] = [
    // generate samplequestionlist data type IQnAQuestion
    //  {
    //      id: '1',
    //      question: 'How to use this app?',
    //      isAnswered: true,
    //      likeCount: 0,
    //  },
    //  {
    //      id: '2',
    //      question: 'what is the best way to use this app?',
    //      isAnswered: false,
    //      likeCount: 34,
    //  },
    //  {
    //      id: '3',
    //      question: 'random string',
    //      isAnswered: false,
    //      likeCount: 10,
    //  },
    //  {
    //      id: '4',
    //      question: 'Guideline',
    //      isAnswered: true,
    //      likeCount: 234,
    //  },
    //  {
    //      id: '5',
    //      question: 'what is the best way to use this app?',
    //      isAnswered: false,
    //      likeCount: 34,
    //  },
    //  {
    //      id: '6',
    //      question: 'random string',
    //      isAnswered: false,
    //      likeCount: 10,
    //  },
    //  {
    //      id: '7',
    //      question: 'Guideline',
    //      isAnswered: true,
    //      likeCount: 234,
    //  },
    //  {
    //      id: '8',
    //      question: 'How do I change my account settings?',
    //      isAnswered: false,
    //      likeCount: 0,
    //      },
    //      {
    //      id: '9',
    //      question: 'What are the different features of this app?',
    //      isAnswered: true,
    //      likeCount: 15,
    //      },
    //      {
    //      id: '10',
    //      question: 'How do I troubleshoot an issue with the app?',
    //      isAnswered: false,
    //      likeCount: 2,
    //      },
    //      {
    //      id: '11',
    //      question: 'What are the system requirements for using this app?',
    //      isAnswered: true,
    //      likeCount: 25,
    //      },
    //      {
    //      id: '12',
    //      question: 'Is there a user manual or documentation available for this app?',
    //      isAnswered: true,
    //      likeCount: 7,
    //      },
    //      {
    //      id: '13',
    //      question: 'Is there a way to customize the appearance of the app?',
    //      isAnswered: false,
    //      likeCount: 0,
    //      },
    //      {
    //      id: '14',
    //      question: 'Are there any discounts or promotions currently available for this app?',
    //      isAnswered: false,
    //      likeCount: 0,
    //      },
    //      {
    //      id: '15',
    //      question: 'Is this app available in different languages?',
    //      isAnswered: true,
    //      likeCount: 19,
    //      }
]
function QnA({
    isOpen,
    handleVisible,
    presentationCode,
    comingQuestion,
}: {
    isOpen: boolean
    handleVisible: (isVisible: boolean) => void
    presentationCode: string
    comingQuestion: IQnAQuestion | null
}) {
    const [questionList, setQuestionList] = useState<IQnAQuestion[]>([])
    const [hashMore, setHasMore] = useState(true)
    const [form] = Form.useForm()
    const fetchMessages = async (pageNumber: number) => {
        try {
            const res = await publicInstance.get(
                `/presentation/qna/get-question-list/${presentationCode}?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
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
    const handleOnclickMarkAsAnsweredOrUnanswered = async (id: string) => {
        try {
            // const res = await privateInstance.post(`/presentation/chat/messages/${id}/answer`)
            if (true) {
                setQuestionList((prev) => {
                    const index = prev.findIndex((question) => question.id === id)
                    prev[index]['isAnswered'] = !prev[index]['isAnswered']
                    return [...prev]
                })
            } else {
                failureModal('Something is wrong')
            }
        } catch (error) {
            failureModal('Something is wrong', error.response && error.response.data)
        }
    }
    useEffect(() => {
        if (!comingQuestion) {
            fetchMessages(1)
            // setQuestionList(sampleQuestionList)
        } else {
            // setQuestionList((prev) => [...prev, questionList])
            setQuestionList((prev) => [...prev, comingQuestion])
            setHasMore(true)
        }
    }, [comingQuestion])
    const { mutate } = useMutation((addMessageData) => {
        const profile = localStorage.getItem('profile')
        if (!profile) {
            return publicInstance.post('/presentation/qna/add-anonymous-question', addMessageData)
        }
        return publicInstance.post('/presentation/qna/add-anonymous-question', addMessageData)
    })
    const handleSubmit = (qnaQuestion: any) => {
        form.resetFields()

        const payload: any = {
            qnaQuestion,
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
                                <div
                                    id="scrollableDiv"
                                    style={{
                                        height: 600,
                                        overflow: 'auto',
                                        overflowX: 'hidden',
                                        padding: '0 16px',
                                    }}
                                >
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
                                        threshold={0}
                                    >
                                        <List
                                            // filter then sort by likeCount
                                            dataSource={questionList
                                                .filter(
                                                    (question) =>
                                                        question.isAnswered === isAnswered,
                                                )
                                                .sort((a, b) => b.likeCount - a.likeCount)}
                                            renderItem={(item) => (
                                                <List.Item key={item.id}>
                                                    <List.Item.Meta
                                                        // avatar={<Avatar src={item.picture.large} />}
                                                        title={
                                                            <a className={styles['question-text']}>
                                                                {item.question}
                                                            </a>
                                                        }
                                                        description={
                                                            <span
                                                                className={
                                                                    styles['mark-as-answered-text']
                                                                }
                                                                onClick={() =>
                                                                    handleOnclickMarkAsAnsweredOrUnanswered(
                                                                        item.id,
                                                                    )
                                                                }
                                                            >
                                                                {!item.isAnswered
                                                                    ? 'Mark as Answered'
                                                                    : 'Mark as Unanswered'}
                                                            </span>
                                                        }
                                                    />
                                                    <div>
                                                        <LikeOutlined /> {item.likeCount}
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </InfiniteScroll>
                                </div>
                            ),

                            // add end here
                        }
                    })}
                />
            </div>

            <Form onFinish={handleSubmit} className={styles.form} form={form}>
                <Form.Item name="question" noStyle>
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
