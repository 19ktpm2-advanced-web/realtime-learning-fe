import { EllipsisOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { IPresentation } from '../../interfaces'

const PresentationList = ({ presentations }: { presentations: IPresentation[] }) => {
    const navigate = useNavigate()
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Owner',
            dataIndex: 'createdBy',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Inviting Code',
            dataIndex: 'inviteCode',
        },
        {
            title: '',
            dataIndex: '',
            render: () => <EllipsisOutlined />,
        },
    ]
    return (
        <Table
            dataSource={presentations}
            columns={columns}
            onRow={(record) => {
                return {
                    onClick: () => {
                        console.log(record)
                        navigate(`/presentation/${record.id}`)
                    },
                }
            }}
        />
    )
}
export default PresentationList
