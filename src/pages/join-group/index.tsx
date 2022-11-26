import GroupList from 'components/groupList'
import { IGroup } from 'interfaces/group/group.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'

function JoinGroup() {
    const [groupList, setGroupList] = useState<IGroup[]>([])

    useQuery(['groupList'], async () => {
        const res = await instance.get('/group/groupJoined')
        setGroupList(res.data.groups)
    })
    return <GroupList groupList={groupList} />
}
export default JoinGroup
