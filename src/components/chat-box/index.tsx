/* eslint-disable */
import { Modal } from 'antd'
import { MessageBox, MessageList } from 'react-chat-elements'
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
                padding: '1em',
                overflowY: 'auto',
                maxHeight: '200px',
                maxWidth: '100%',
                whiteSpace: 'initial',
            }}
        >
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
        </Modal>
    )
}

export default ChatBox
