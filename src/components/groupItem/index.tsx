/* eslint-disable */
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import { IGroup } from 'interfaces/group/IGroup.interface'
import styles from './styles.module.css'

const { Meta } = Card

const GroupItem = ({ data }: { data: IGroup }) => (
    <Card
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
export default GroupItem
