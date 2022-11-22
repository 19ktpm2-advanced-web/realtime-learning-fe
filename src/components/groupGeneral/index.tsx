import { Image } from 'antd'
import { IGroup } from 'interfaces/group/IGroup.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'

function GroupGeneral({ groupId }: { groupId?: String }) {
    const [group, setGroup] = useState<IGroup>()
    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        setGroup(res.data)
    })
    return (
        <div>
            <Image src={group?.background} />
            <h2 className="">{group?.name}</h2>
            <p>{group?.description}</p>
            <p>Owner by: {group?.owner?.fullName}</p>
        </div>
    )
}
export default GroupGeneral
