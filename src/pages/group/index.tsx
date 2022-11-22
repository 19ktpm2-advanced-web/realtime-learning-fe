import GroupList from 'components/groupList'
import { Button, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

function Group() {
    const navigate = useNavigate()
    const handlerCreateNewGroupClick = () => {
        navigate('/create-group')
    }
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
                <GroupList />
            </div>
        </div>
    )
}

export default Group
