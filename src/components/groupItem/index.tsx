/* eslint-disable */
import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import DeleteModal from 'components/deleteModal'
import InvitationCard from 'components/invitation-card'
import { failureModal } from 'components/modals'
import { Privilege } from 'enums'
import { IGroup } from 'interfaces/group/group.interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

const { Meta } = Card

const GroupItem = ({ data, permission }: { data: IGroup; permission: Privilege[] }) => {
    const [showCopyLinkModal, setShowCopyLinkModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const navigate = useNavigate()
    const actions = []
    if (permission?.includes(Privilege.EDITING)) {
        actions.push(
            <EditOutlined key="edit" onClick={() => navigate(`/groups/${data.id}/edit`)} />,
        )
    }
    if (permission?.includes(Privilege.INVITING)) {
        actions.push(<LinkOutlined key="link" onClick={() => setShowCopyLinkModal(true)} />)
    }
    if (permission?.includes(Privilege.DELETING)) {
        actions.push(<DeleteOutlined key="delete" onClick={() => setShowDeleteModal(true)} />)
    }
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
                actions={actions}
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
