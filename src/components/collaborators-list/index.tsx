/* eslint-disable */
import { useEffect, useState } from 'react'
import { Avatar, Empty, List, Skeleton } from 'antd'
import { IUser } from '../../interfaces'
import instance from '../../service/axiosPrivate'
import { failureModal } from '../modals'
import InfiniteScroll from 'react-infinite-scroller'

const COLLABORATORS_LIMIT = 3

const CollaboratorsList = ({ presentationId }: { presentationId: string }) => {
    const [loading, setLoading] = useState(false)
    const [hashMore, setHasMore] = useState(true)
    const profile: IUser = JSON.parse(localStorage.getItem('profile') || '')
    const [data, setData] = useState<IUser[]>([{ ...profile }])

    const loadMoreData = async () => {
        if (loading) {
            return
        }
        setLoading(true)

        try {
            const res = await instance.get(
                `/presentation/collaborators/${presentationId}?skip=${
                    data.length > 1 ? data.length : 0
                }&limit=${COLLABORATORS_LIMIT}`,
            )
            if (res?.status === 200) {
                setData([...data, ...res.data])
                if (res.data.length <= 0) {
                    setHasMore(false)
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
        console.log('presentationId: ', presentationId)
        loadMoreData()
    }, [])

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
                        renderItem={(item) => (
                            <List.Item key={item.email}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a href="https://ant.design">{item.email}</a>}
                                    description={
                                        profile?.email === item.email ? 'Owner' : 'Collaborators'
                                    }
                                />
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
