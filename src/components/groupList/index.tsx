import { Empty } from 'antd'
import GroupItem from 'components/groupItem'
import { IGroup } from 'interfaces/group/group.interface'
import styles from './styles.module.css'

const GroupList = ({ groupList }: { groupList: IGroup[] }) => {
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
