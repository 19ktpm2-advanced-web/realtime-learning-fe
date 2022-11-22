import GroupList from 'components/groupList'
import { Button, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import { useState } from 'react'
import { IGroup } from 'interfaces/group/IGroup.interface'
import { useQuery } from 'react-query'
import styles from './styles.module.css'

function MyGroup() {
    const navigate = useNavigate()
    const handlerCreateNewGroupClick = () => {
        navigate('/create-group')
    }
    const [groupList, setGroupList] = useState<IGroup[]>([])
    useQuery(['groupList'], async () => {
        const res = await instance.get('/group/getOwn')
        setGroupList(res.data.groups)
    })
    return (
        <div>
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
                    size="large"
                >
                    Create New Group
                </Button>
            </div>
            <Divider />
            <div className={styles.body}>
                <GroupList groupList={groupList} />
            </div>
        </div>
    )
}

export default MyGroup
