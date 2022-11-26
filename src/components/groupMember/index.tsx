import { Avatar, List } from 'antd'
import { failureModal } from 'components/modals'
import { IGroup } from 'interfaces'
import { IMember } from 'interfaces/user/user.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function GroupMember({ groupId }: { groupId?: String }) {
    const [members, setMembers] = useState<IMember[]>([])
    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        if (res.status === 200) {
            const { group }: { group: IGroup } = res.data
            if (group.owner) {
                setMembers([group.owner])
            }
            if (group.coOwners) {
                setMembers((prev) => [...prev, ...group.coOwners])
            }
            if (group.members) {
                setMembers((prev) => [...prev, ...group.members])
            }
        } else {
            failureModal('Failed to get group detail', res.statusText)
        }
    })
    return (
        <div className={styles.wrapper}>
            <List
                header={<h2>All Members</h2>}
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(item: IMember) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={item?.fullName}
                            description={`${item?.email}`}
                        />
                        <List.Item.Meta title={item.role.name} />
                    </List.Item>
                )}
            />
        </div>
    )
}
export default GroupMember
