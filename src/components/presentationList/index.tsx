/* eslint-disable */
import { useState } from 'react'
import {
    DeleteOutlined,
    EllipsisOutlined,
    ExclamationCircleFilled,
    ShareAltOutlined,
} from '@ant-design/icons'
import { Dropdown, MenuProps, Modal, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { IPresentation } from '../../interfaces'
import instance from '../../service/axiosPrivate'
import { useMutation } from 'react-query'
import { failureModal, successModal } from '../modals'
import InviteCollaboratorsModal from '../invite-collaborators-modal'

const PresentationList = ({
    presentations,
    onPresentationDeleted,
}: {
    presentations: IPresentation[]
    onPresentationDeleted: () => void
}) => {
    const navigate = useNavigate()
    const [presentationOnFocusId, setPresentationOnFocusId] = useState('')
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false)
    const { confirm } = Modal

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this presentation?',
            icon: <ExclamationCircleFilled />,
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeletePresentation()
            },
        })
    }

    const { mutate } = useMutation(({ presentationId }: { presentationId: string }) => {
        return instance.delete(`/presentation/delete/${presentationId}`)
    })

    const handleDeletePresentation = () => {
        const payload: any = {
            presentationId: presentationOnFocusId,
        }
        mutate(payload, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    successModal('Presentation deleted successfully')

                    // Re-render presentations list
                    onPresentationDeleted()
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Something is wrong', error.response && error.response.data)
            },
        })
    }

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        e.domEvent.stopPropagation()
        switch (e.key) {
            case 'invite-collab':
                setIsInvitationModalOpen(true)
                break
            case 'delete':
                showDeleteConfirm()
                break
        }
    }

    const items: MenuProps['items'] = [
        {
            label: 'Invite collaborators',
            key: 'invite-collab',
            icon: <ShareAltOutlined />,
        },
        {
            label: 'Delete',
            key: 'delete',
            icon: <DeleteOutlined />,
            danger: true,
        },
    ]

    const menuProps = {
        items,
        onClick: handleMenuClick,
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Inviting Code',
            dataIndex: 'inviteCode',
            key: 'inviteCode',
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: () => (
                <Dropdown menu={menuProps}>
                    <EllipsisOutlined
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    />
                </Dropdown>
            ),
        },
    ]

    return (
        <>
            <Table
                dataSource={presentations}
                columns={columns}
                onRow={(record) => {
                    return {
                        onClick: (e) => {
                            navigate(`/presentation/${record.id}`)
                        },
                        onFocus: (e) => {
                            setPresentationOnFocusId(record.id || '')
                        },
                    }
                }}
            />
            <InviteCollaboratorsModal
                isModalOpen={isInvitationModalOpen}
                handleOk={() => setIsInvitationModalOpen(false)}
                handleCancel={() => setIsInvitationModalOpen(false)}
                presentationId={presentationOnFocusId}
            />
        </>
    )
}
export default PresentationList
