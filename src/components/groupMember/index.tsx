import { Avatar, List } from 'antd'
import { IUser } from 'interfaces/user/IUser.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

interface IMember extends IUser {
    role: string
}
function GroupMember({ groupId }: { groupId?: String }) {
    const [members, setMembers] = useState<IMember[]>([])
    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        const owner = {
            ...res.data.owner,
            role: 'Owner',
        }
        const memberData = res.data.members.map((member: IUser) => {
            return {
                ...member,
                role: 'Member',
            }
        })
        const coOwners = res.data.coOwners.map((coOwner: IUser) => {
            return {
                ...coOwner,
                role: 'Co-owner',
            }
        })
        setMembers([owner, ...memberData, ...coOwners])
    })
    return (
        <div className={styles.wrapper}>
            <List
                header={<h2>All Members</h2>}
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(item: IMember) => (
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={item?.fullName} description={`${item?.email}`} />
                        <List.Item.Meta title={item?.role} />
                    </List.Item>
                )}
            />
        </div>
    )
}
export default GroupMember
