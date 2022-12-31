/* eslint-disable */
import { Modal } from 'antd'
import { IUser } from 'interfaces'
import UserAnswerList from 'components/user-answer-list'

function UserAnswerModal({
    isModalOpen,
    slideId,
    optionId,
    handleClose,
}: {
    isModalOpen: boolean
    slideId: string
    optionId: string
    handleClose: () => void
}) {
    return (
        <Modal
            title={'Answered'}
            open={isModalOpen}
            footer={null}
            onCancel={handleClose}
            getContainer={false}
        >
            <UserAnswerList slideId={slideId} optionId={optionId} />
        </Modal>
    )
}

export default UserAnswerModal
