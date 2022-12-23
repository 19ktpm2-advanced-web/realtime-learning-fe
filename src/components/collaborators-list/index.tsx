/* eslint-disable */
import { useEffect, useState } from 'react'
import { Avatar, Empty, List, Modal, Skeleton } from 'antd'
import { IUser } from '../../interfaces'
import instance from '../../service/axiosPrivate'
import { failureModal, successModal } from '../modals'
import InfiniteScroll from 'react-infinite-scroller'
import { CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { useMutation } from 'react-query'

const COLLABORATORS_LIMIT = 3

const CollaboratorsList = ({ presentationId }: { presentationId: string }) => {
    const [loading, setLoading] = useState(false)
    const [hashMore, setHasMore] = useState(true)
    const profile: IUser = JSON.parse(localStorage.getItem('profile') || '')
    const [data, setData] = useState<IUser[]>([])
    const [presentationIdChanged, setPresentationIdChanged] = useState(false)
    const [collaboratorDeleted, setCollaboratorDeleted] = useState(false)

    const { confirm } = Modal
    const showDeleteConfirm = (index: number) => {
        confirm({
            title: 'Are you sure remove this collaborator?',
            icon: <ExclamationCircleFilled />,
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteCollaborator(index)
            },
        })
    }

    const { mutate } = useMutation(
        ({
            presentationId,
            collaboratorId,
        }: {
            presentationId: string
            collaboratorId: string
        }) => {
            return instance.delete(
                `/presentation/delete/collaborator/${presentationId}&${collaboratorId}`,
            )
        },
    )
    const handleDeleteCollaborator = (index: number) => {
        const payload: any = {
            presentationId,
            collaboratorId: data[index].id,
        }
        mutate(payload, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    successModal('Collaborator removed successfully')

                    // Re-render collaborator list
                    setCollaboratorDeleted(!collaboratorDeleted)
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Something is wrong', error.response && error.response.data)
            },
        })
    }

    const loadMoreData = async () => {
        if (loading) {
            return
        }
        setLoading(true)

        try {
            const res = await instance.get(
                `/presentation/collaborators/${presentationId}?skip=${
                    data.length > 1 ? data.length - 1 : data.length
                }&limit=${COLLABORATORS_LIMIT}`,
            )
            if (res?.status === 200) {
                if (data.length >= 1 && res.data.length <= 1) {
                    setHasMore(false)
                } else {
                    setData([...data, ...res.data])
                }

                setLoading(false)
            } else {
                setLoading(false)
                failureModal('Something is wrong', res.statusText)
            }
        } catch (error) {
            failureModal('Something is wrong', error.response && error.response.data)
        }
    }

    useEffect(() => {
        setData([])
        setPresentationIdChanged(!presentationIdChanged)
    }, [presentationId, collaboratorDeleted])

    useEffect(() => {
        loadMoreData()
    }, [presentationIdChanged])

    return (
        <div
            id="scrollableDiv"
            style={{
                height: 200,
                overflow: 'auto',
                padding: '0 16px',
            }}
        >
            <InfiniteScroll
                pageStart={0}
                loadMore={loadMoreData}
                hasMore={hashMore}
                loader={<Skeleton avatar paragraph={{ rows: 0 }} active />}
                useWindow={false}
            >
                {data.length > 0 ? (
                    <List
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item key={item.email}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a href="https://ant.design">{item.email}</a>}
                                    description={index === 0 ? 'Owner' : 'Collaborators'}
                                />
                                {profile.email === data[0].email && index !== 0 ? (
                                    <CloseOutlined onClick={() => showDeleteConfirm(index)} />
                                ) : null}
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="No collaborators" />
                )}
            </InfiniteScroll>
        </div>
    )
}
export default CollaboratorsList
