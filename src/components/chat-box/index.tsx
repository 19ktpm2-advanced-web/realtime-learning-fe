import { Button, Form, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useEffect, useState } from 'react'
import { MessageBox } from 'react-chat-elements'
import InfiniteScroll from 'react-infinite-scroller'
import { failureModal } from 'components/modals'
// RCE CSS
import 'react-chat-elements/dist/main.css'
import { useMutation } from 'react-query'
import { IMessage } from '../../interfaces/message'
import publicInstance from '../../service/axiosPublic'
import privateInstance from '../../service/axiosPrivate'
import styles from './style.module.css'

const PAGE_SIZE = 20
function ChatBox({
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
    const [messages, setMessages] = useState<IMessage[]>([])
    const [hashMore, setHasMore] = useState(true)
    const [form] = Form.useForm()
    const fetchMessages = async (pageNumber: number) => {
        console.log('Fetch message', pageNumber)
        try {
            const res = await publicInstance.get(
                `/presentation/chat/messages/${presentationCode}?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
            )
            if (res?.status === 200) {
                res.data.reverse()
                setMessages((prev) => [...res.data, ...prev])
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
        } else {
            setMessages((prev) => [...prev, comingMessage])
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
            title="Chat"
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
                    {messages.map((message) => {
                        return (
                            <MessageBox
                                /* @ts-ignore */
                                position="left"
                                title={message.title}
                                text={message.text}
                                type="text"
                                date={message.date}
                            />
                        )
                    })}
                </InfiniteScroll>
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

export default ChatBox
