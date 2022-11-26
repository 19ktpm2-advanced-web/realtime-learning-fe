import { Divider } from 'antd'
import GroupList from 'components/groupList'
import { IGroup } from 'interfaces/group/group.interface'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/navbar/index'

function JoinGroup() {
    const navigate = useNavigate()
    const [groupList, setGroupList] = useState<IGroup[]>([])

    useEffect(() => {
        if (!localStorage.getItem('session')) {
            navigate('/login')
        }
    }, [localStorage.getItem('session')])

    useQuery(['groupList'], async () => {
        const res = await instance.get('/group/groupJoined')
        setGroupList(res.data.groups)
    })
    return (
        <div>
            <NavBar />
            <Divider orientation="left">Joined Groups</Divider>
            <GroupList groupList={groupList} />
        </div>
    )
}
export default JoinGroup
