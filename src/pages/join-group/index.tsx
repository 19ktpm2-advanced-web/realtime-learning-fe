import GroupList from 'components/groupList'
import { Privilege } from 'enums'
import { IGroup } from 'interfaces/group/group.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'

function JoinGroup() {
    const [groupList, setGroupList] = useState<IGroup[]>([])
    const [permission, setPermission] = useState<Privilege[]>([])
    useQuery(['groupList'], async () => {
        const res = await instance.get('/group/groupJoined')
        setGroupList(res.data.groups)
        setPermission(res.data.permission)
    })
    return <GroupList groupList={groupList} permission={permission} />
}
export default JoinGroup
