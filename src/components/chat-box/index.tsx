/* eslint-disable */
import { Button, Form, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { MessageBox } from 'react-chat-elements'
// RCE CSS
import 'react-chat-elements/dist/main.css'
import styles from './style.module.css'

function ChatBox({
    isOpen,
    handleVisible,
}: {
    isOpen: boolean
    handleVisible: (isVisible: boolean) => void
}) {
    return (
        <Modal
            title="Chat"
            centered
            open={isOpen}
            footer={null}
            onCancel={() => handleVisible(false)}
            bodyStyle={{
                padding: 0,
                height: '200px',
                maxWidth: '100%',
            }}
        >
            <div className={styles['message-box']}>
                <MessageBox
                    /* @ts-ignore */
                    position="left"
                    title="Burhan"
                    type="text"
                    text="Hi there !"
                    date={new Date()}
                />
                <MessageBox
                    /* @ts-ignore */
                    position="left"
                    title="Burhan"
                    type="text"
                    text="Hi there !"
                    date={new Date()}
                />
                <MessageBox
                    /* @ts-ignore */
                    position="left"
                    title="Burhan"
                    type="text"
                    text="Hi there !"
                    date={new Date()}
                />
                <MessageBox
                    /* @ts-ignore */
                    position="left"
                    title="Burhan"
                    type="text"
                    text="Hi there !"
                    date={new Date()}
                />
            </div>
            <Form
                // onFinish={handleSubmit}
                className={styles['form']}
                // form={form}
            >
                <Form.Item noStyle>
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
