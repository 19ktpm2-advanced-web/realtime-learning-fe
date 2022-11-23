/* eslint-disable */
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import { failureModal } from 'components/modals'
import { IGroup } from 'interfaces/group/group.interface'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

const { Meta } = Card

const GroupItem = ({ data }: { data: IGroup }) => {
    const navigate = useNavigate()
    const handleClick = () => {
        if (data.id) {
            navigate(`/group/${data.id}`)
        } else {
            failureModal('Missing group id', 'Please contact admin')
        }
    }
    return (
        <Card
            onClick={handleClick}
            className={styles.wrapper}
            cover={
                <div className={styles.bgContainer}>
                    <img className={styles.background} alt={data.name} src={data.background} />
                </div>
            }
            actions={[<SettingOutlined key="setting" />, <EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
        >
            <Meta avatar={<Avatar src={data.avatar} />} title={data.name} description={data.description} />
        </Card>
    )
}
export default GroupItem
