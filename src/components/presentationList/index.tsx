import { Table } from 'antd'
import { IPresentation } from '../../interfaces'

const PresentationList = ({ presentations }: { presentations: IPresentation[] }) => {
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
    ]
    return <Table dataSource={presentations} columns={columns} />
}
export default PresentationList
