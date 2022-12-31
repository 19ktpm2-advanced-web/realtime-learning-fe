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
import { CheckOutlined, CloseOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons'
import { log } from 'console'

const PAGE_SIZE = 20
function QnA({
    isOpen,
    handleVisible,
    presentationCode,
    comingQuestion,
    isPresenterRole,
}: {
    isOpen: boolean
    handleVisible: (isVisible: boolean) => void
    presentationCode: string
    comingQuestion: IQnAQuestion | null
    isPresenterRole: boolean
}) {
    const [questionList, setQuestionList] = useState<IQnAQuestion[]>([])
    const [hashMore, setHasMore] = useState(true)
    const [form] = Form.useForm()
    const fetchMessages = async (pageNumber: number) => {
        if (presentationCode) {
            try {
                const res = await publicInstance.get(
                    `/presentation/qna/get-question-list/${presentationCode}?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
                )
                if (res?.status === 200) {
                    res.data.reverse()
                    setQuestionList((prev) => [
                        ...res.data.filter(
                            (question: IQnAQuestion) =>
                                !prev.find((prevQuestion) => prevQuestion.id === question.id),
                        ),
                        ...prev,
                    ])
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
        
    }
    const handleOnclickMarkAsAnsweredOrUnanswered = async (id: string) => {
        try {
            const newQuestionList = questionList.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        isAnswered: !item.isAnswered,
                    }
                }
                return item
            })

            const res = await publicInstance.put(
                `/presentation/qna/update-question/${presentationCode}`,
                newQuestionList.find((item) => item.id === id),
            )
            if (res?.status === 200) {
                setQuestionList(newQuestionList)
            } else {
                failureModal('Something is wrong', res.statusText)
            }
        } catch (error) {
            failureModal('Something is wrong', error.response && error.response.data)
        }
    }
    const handleOnclickLikeButton = async (id: string) => {
        try {
            const newQuestionList = questionList.map((item) => {
                if (item.isLiked === undefined) {
                    item.isLiked = false
                }
                if (item.id === id) {
                    return {
                        ...item,
                        likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
                        isLiked: !item.isLiked,
                    }
                }
                return item
            })
            setQuestionList(newQuestionList)
            const res = await publicInstance.put(
                `/presentation/qna/update-question/${presentationCode}`,
                newQuestionList.find((item) => item.id === id),
            )
            if (res.status === 200) {
                setQuestionList(newQuestionList)
            } else {
                failureModal('Something is wrong', res.statusText)
            }
        } catch (error) {
            failureModal('Something is wrong', error.response && error.response.data)
        }
    }

    useEffect(() => {
        if (!comingQuestion) {
            fetchMessages(1)
        } else {
            // Check if comingQuestion already exists in the questionList
            if (!questionList.find((item) => item.id === comingQuestion.id)) {
                setQuestionList((prev) => [...prev, comingQuestion])
                setHasMore(true)
            } else {
                // If comingQuestion does exist in the questionList, check if it has been updated
                const currentQuestion = questionList.find((item) => item.id === comingQuestion.id)
                if (JSON.stringify(currentQuestion) !== JSON.stringify(comingQuestion)) {
                    const newQuestionList = questionList.map((item) => {
                        if (item.id === comingQuestion.id) {
                            return {
                                ...item,
                                likeCount: comingQuestion.likeCount,
                                isAnswered: comingQuestion.isAnswered,
                            }
                        }
                        return item
                    })
                    setQuestionList(newQuestionList)
                    setHasMore(true)
                }
            }
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
                height: '78vh',
                maxWidth: '100%',
            }}
        >
            <div className={styles['message-list-wrapper']}>
                <Tabs
                    centered
                    tabPosition="top"
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
                                        // loader={
                                        //     <div className="loader" key={0}>
                                        //         Loading ...
                                        //     </div>
                                        // }
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
                                                                hidden={!isPresenterRole}
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
                                                    <div
                                                        className={styles['like-button']}
                                                        onClick={() => {
                                                            // only listening when isPresenterRole is true
                                                            if (
                                                                !isPresenterRole &&
                                                                !item.isAnswered
                                                            ) {
                                                                handleOnclickLikeButton(item.id)
                                                            }
                                                        }}
                                                    >
                                                        {!isPresenterRole && item.isLiked ? (
                                                            <LikeFilled />
                                                        ) : (
                                                            <LikeOutlined />
                                                        )}{' '}
                                                        {item.likeCount}
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

            {!isPresenterRole && (
                <Form onFinish={handleSubmit} className={styles.form} form={form}>
                    <Form.Item name="question" noStyle>
                        <div className={styles['chat-area']}>
                            <TextArea
                                className={styles['chat-input']}
                                placeholder="Type your question here..."
                                autoSize={false}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item noStyle>
                        <div className={styles['submit-btn-wrapper']}>
                            <Button
                                className={styles['submit-btn']}
                                type="primary"
                                htmlType="submit"
                            >
                                Send
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    )
}

export default QnA
