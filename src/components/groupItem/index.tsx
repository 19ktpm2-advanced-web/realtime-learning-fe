/* eslint-disable */
import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import DeleteModal from 'components/deleteModal'
import InvitationCard from 'components/invitation-card'
import { failureModal } from 'components/modals'
import { IGroup } from 'interfaces/group/group.interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

const { Meta } = Card

const GroupItem = ({ data }: { data: IGroup }) => {
    const [showCopyLinkModal, setShowCopyLinkModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const navigate = useNavigate()
    const handleClick = () => {
        if (data.id) {
            navigate(`/group/${data.id}`)
        } else {
            failureModal('Missing group id', 'Please contact admin')
        }
    }
    return (
        <div>
            <Card
                className={styles.wrapper}
                cover={
                    <div className={styles.bgContainer}>
                        <img
                            onClick={handleClick}
                            className={styles.background}
                            alt={data.name}
                            src={data.background}
                        />
                    </div>
                }
                actions={[
                    <EditOutlined key="edit" />,
                    <LinkOutlined
                        key="invite"
                        onClick={() => setShowCopyLinkModal((showLink) => !showLink)}
                    />,
                    <DeleteOutlined key="delete" onClick={() => setShowDeleteModal(true)} />,
                ]}
            >
                <Meta
                    avatar={<Avatar src={data.avatar} />}
                    title={
                        <div className={styles.title} onClick={handleClick}>
                            {data.name}
                        </div>
                    }
                    description={data.description}
                />
            </Card>
            {
                // <CopyLinkModal
                showCopyLinkModal && <InvitationCard group={data} />
            }
            {
                // <DeleteModal
                showDeleteModal && (
                    <DeleteModal
                        name={data.name}
                        onFinish={async () => {
                            const result = await instance.delete(`/group/delete/${data.id}`)
                            console.log('result', result?.data)
                            setShowDeleteModal(false)
                            window.location.reload()
                        }}
                    />
                )
            }
        </div>
    )
}
export default GroupItem
