import { useQuery } from 'react-query'
import { Empty } from 'antd'
import GroupItem from 'components/groupItem'
import { IGroup } from 'interfaces/group/IGroup.interface'
import instance from 'service/axiosPrivate'
import { useState } from 'react'
import styles from './styles.module.css'

const GroupList = () => {
    const [groupList, setGroupList] = useState<IGroup[]>([])
    useQuery(['groupList'], async () => {
        const res = await instance.get('/group/getOwn')
        setGroupList(res.data.groups)
    })
    return (
        <div className={styles.groupWrapper}>
            {groupList.length > 0 ? (
                groupList.map((group: IGroup, index: number) => {
                    return <GroupItem key={index} data={group} />
                })
            ) : (
                <Empty description="No group found" />
            )}
        </div>
    )
}
export default GroupList
