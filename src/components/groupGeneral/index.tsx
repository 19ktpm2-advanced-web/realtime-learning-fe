import { Image } from 'antd'
import { IGroup } from 'interfaces/group/group.interface'
import { useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function GroupGeneral({ groupId }: { groupId?: String }) {
    const [group, setGroup] = useState<IGroup>()
    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        setGroup(res.data)
    })
    return (
        <div className={styles.wrapper}>
            <Image className={styles.banner} src={group?.background} />
            <div className={styles.contentWrapper}>
                <h2 className="">{group?.name}</h2>
                <p>{group?.description}</p>
                <p>Owner by: {group?.owner?.fullName}</p>
            </div>
        </div>
    )
}
export default GroupGeneral
