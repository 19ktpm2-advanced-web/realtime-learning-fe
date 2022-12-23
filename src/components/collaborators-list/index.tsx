/* eslint-disable */
import { useEffect, useState } from 'react'
import { Avatar, Empty, List, Skeleton } from 'antd'
import { IUser } from '../../interfaces'
import instance from '../../service/axiosPrivate'
import { failureModal } from '../modals'
import InfiniteScroll from 'react-infinite-scroller'
import { CloseOutlined } from '@ant-design/icons'

const COLLABORATORS_LIMIT = 3

const CollaboratorsList = ({ presentationId }: { presentationId: string }) => {
    const [loading, setLoading] = useState(false)
    const [hashMore, setHasMore] = useState(true)
    const [data, setData] = useState<IUser[]>([])
    const [presentationIdChanged, setPresentationIdChanged] = useState(false)

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
                if (res.data.length <= 1) {
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
    }, [presentationId])

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
                                <CloseOutlined />
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
