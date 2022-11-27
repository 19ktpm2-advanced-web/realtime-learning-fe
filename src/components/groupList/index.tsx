import { Empty } from 'antd'
import GroupItem from 'components/groupItem'
import { Privilege } from 'enums'
import { IGroup } from 'interfaces/group/group.interface'
import styles from './styles.module.css'

const GroupList = ({ groupList, permission }: { groupList: IGroup[]; permission: Privilege[] }) => {
    return (
        <div className={styles.groupWrapper}>
            {groupList.length > 0 ? (
                groupList.map((group: IGroup, index: number) => {
                    return <GroupItem key={index} data={group} permission={permission} />
                })
            ) : (
                <Empty description="No group found" />
            )}
        </div>
    )
}
export default GroupList
