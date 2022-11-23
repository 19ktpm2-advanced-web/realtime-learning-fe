import GroupGeneral from 'components/groupGeneral'
import GroupMember from 'components/groupMember'
import TabCustom from 'components/tab-custom'
import { useParams } from 'react-router-dom'

function GroupDetail() {
    const { groupId } = useParams()
    const generalComponent = <GroupGeneral groupId={groupId} />
    const memberComponent = <GroupMember groupId={groupId} />
    const tabs = [
        {
            key: 'general',
            content: 'General',
            component: generalComponent,
        },
        {
            key: 'members',
            content: 'Members',
            component: memberComponent,
        },
    ]
    return (
        <div>
            <TabCustom tabs={tabs} defaultIndex={0} />
        </div>
    )
}
export default GroupDetail
