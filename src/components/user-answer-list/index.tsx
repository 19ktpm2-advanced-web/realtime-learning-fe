/* eslint-disable */
import { useEffect, useState } from 'react'
import { Avatar, Empty, List, Modal, Skeleton } from 'antd'
import { IAnswerInfo, IUser } from '../../interfaces'
import { failureModal, successModal } from '../modals'
import InfiniteScroll from 'react-infinite-scroller'
import instance from 'service/axiosPrivate'
import dayjs from 'dayjs'

const LIMIT = 3

const UserAnswerList = ({ slideId, optionId }: { slideId: string; optionId: string }) => {
    const [loading, setLoading] = useState(false)
    const [hashMore, setHasMore] = useState(true)
    const profile: IUser = JSON.parse(localStorage.getItem('profile') || '')
    const [data, setData] = useState<IAnswerInfo[]>([])
    const [optionIdChanged, setOptionIdChanged] = useState(false)

    const loadMoreData = async () => {
        if (loading) {
            return
        }
        setLoading(true)

        try {
            const res = await instance.get(
                `/presentation/slide/user-answers/${slideId}&${optionId}?skip=${
                    data.length > 1 ? data.length - 1 : data.length
                }&limit=${LIMIT}`,
            )
            if (res?.status === 200) {
                if (res.data.length <= 1) {
                    setHasMore(false)
                }

                if ((res.data.length === 1 && data.length === 0) || res.data.length > 1)
                    setData([...data, ...res.data])

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
        setOptionIdChanged(!optionIdChanged)
    }, [optionId])

    useEffect(() => {
        loadMoreData()
    }, [optionIdChanged])

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
                        renderItem={(item, index) => {
                            if (item.user) {
                                return (
                                    <List.Item key={item.user.email}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.user.avatar} />}
                                            title={
                                                <a href="https://ant.design">{item.user.email}</a>
                                            }
                                            description={dayjs(item.answeredAt).format(
                                                'DD/MM/YYYY hh:mm',
                                            )}
                                        />
                                    </List.Item>
                                )
                            }
                            return null
                        }}
                    />
                ) : (
                    <Empty description="No answers" />
                )}
            </InfiniteScroll>
        </div>
    )
}
export default UserAnswerList
