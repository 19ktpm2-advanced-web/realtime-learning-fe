import { Avatar, List } from 'antd'
import { IUser } from 'interfaces/user/IUser.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'

function GroupMember({ groupId }: { groupId?: String }) {
    const [members, setMembers] = useState<IUser[]>([])
    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        setMembers([res.data.owner, ...res.data.coOwners, ...res.data.members])
    })
    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(item: IUser) => (
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={item?.fullName} />
                    </List.Item>
                )}
            />
        </div>
    )
}
export default GroupMember
