/* eslint-disable */
import { Button, Form, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useState } from 'react'
import { MessageList, MessageType } from 'react-chat-elements'
// RCE CSS
import 'react-chat-elements/dist/main.css'
import { useMutation } from 'react-query'
import { IMessage } from '../../interfaces/message'
import publicInstance from '../../service/axiosPublic'
import privateInstance from '../../service/axiosPrivate'
import styles from './style.module.css'

function ChatBox({
    isOpen,
    handleVisible,
    messages,
    presentationCode,
}: {
    isOpen: boolean
    handleVisible: (isVisible: boolean) => void
    messages: IMessage[]
    presentationCode: string
}) {
    const [form] = Form.useForm()
    const { mutate } = useMutation((addMessageData) => {
        const profile = localStorage.getItem('profile')
        if (!profile) {
            return publicInstance.post('/presentation/chat/add-anonymous-message', addMessageData)
        } else {
            return privateInstance.post(
                '/presentation/chat/add-authenticated-message',
                addMessageData,
            )
        }
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
                {/* @ts-ignore */}
                <MessageList
                    toBottomHeight={0}
                    dataSource={messages.map((message) => {
                        /* @ts-ignore */
                        const item: MessageType = {
                            position: 'left',
                            title: message.title,
                            type: 'text',
                            text: message.text,
                            date: message.date,
                        }
                        return item
                    })}
                />
            </div>
            <Form onFinish={handleSubmit} className={styles['form']} form={form}>
                <Form.Item name="message" noStyle>
                    <div className={styles['chat-area']}>
                        <TextArea
                            className={styles['chat-input']}
                            placeholder={'Type here...'}
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
