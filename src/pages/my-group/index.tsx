import GroupList from 'components/groupList'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import { useState } from 'react'
import { IGroup } from 'interfaces/group/group.interface'
import { useQuery } from 'react-query'
import { Privilege } from 'enums'
import { failureModal } from 'components/modals'
import styles from './styles.module.css'

function MyGroup() {
    const navigate = useNavigate()
    const handlerCreateNewGroupClick = () => {
        navigate('/create-group')
    }
    const [groupList, setGroupList] = useState<IGroup[]>([])
    const [permission, setPermission] = useState<Privilege[]>([])
    useQuery(['groupList'], async () => {
        const res = await instance.get('/group/getOwn')
        if (res.status === 200) {
            setGroupList(res.data.groups)
            setPermission(res.data.permission)
        } else {
            failureModal('Failed to get group list', res.statusText)
        }
    })
    return (
        <>
            <div className={styles.header}>
                <Button
                    onClick={handlerCreateNewGroupClick}
                    icon={
                        <PlusOutlined
                            className={styles.iconPl}
                            style={{
                                textAlign: 'center',
                            }}
                        />
                    }
                    className={styles.createGroupBtn}
                    size="small"
                >
                    Create New Group
                </Button>
            </div>
            <div className={styles.body}>
                <GroupList groupList={groupList} permission={permission} />
            </div>
        </>
    )
}

export default MyGroup
