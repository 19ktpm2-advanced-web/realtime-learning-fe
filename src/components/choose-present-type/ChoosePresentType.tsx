import { Modal, Radio, Select } from 'antd'
import { failureModal } from 'components/modals'
import { Access, Privilege } from 'enums'
import { IGroup, IPresentation, ISlide } from 'interfaces'
import { useEffect, useState } from 'react'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

const ChoosePresentType = ({
    presentation,
    slide,
    isOpen,
    setIsOpen,
    onSuccess,
}: {
    presentation: IPresentation
    slide: ISlide
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onSuccess: (access: Access, presentTo: string) => Promise<void>
}) => {
    const [presentAccess, setPresentAccess] = useState<Access>(Access.PUBLIC)
    const [presentTo, setPresentTo] = useState<string>('')
    const [groupList, setGroupList] = useState<IGroup[]>([])
    const fetchGroupList = async () => {
        try {
            const res = await instance.post('/group/groupHasPrivilege', {
                privileges: [Privilege.PRESENTING],
            })
            if (res?.status === 200) {
                setGroupList(res.data.groups)
            } else {
                failureModal('Get group list failed', res.statusText)
            }
        } catch (error) {
            failureModal('Get group list failed', error.response && error.response.data)
        }
    }
    useEffect(() => {
        fetchGroupList()
    }, [])

    const handlePresentClick = async () => {
        if (presentAccess === Access.ONLY_GROUP && presentTo.length === 0) {
            failureModal('Cannot present', 'Please choose group to present')
            return
        }
        const payload: any = {
            presentationId: presentation.id,
            slideId: slide.id,
            isPresenting: true,
            access: presentAccess, // Public / Only group / Only me
            presentTo, // Group id
        }
        try {
            const res = await instance.post('/presentation/slide/update-present-status', payload)
            if (res?.status === 200) {
                await onSuccess(presentAccess, presentTo)
            } else {
                failureModal('Cannot presenting this slide', res.statusText)
            }
        } catch (error) {
            failureModal('Cannot load slide to present', error.response && error.response.data)
        }
        setIsOpen(false)
    }
    return (
        <Modal
            title="Choose present type"
            onCancel={() => setIsOpen(false)}
            onOk={handlePresentClick}
            open={isOpen}
        >
            <div className={styles.container}>
                <div className={styles.accessWrapper}>
                    <Radio.Group
                        onChange={(e) => setPresentAccess(e.target.value)}
                        value={presentAccess}
                        buttonStyle="solid"
                    >
                        <Radio value={Access.PUBLIC}>Public</Radio>
                        <Radio value={Access.ONLY_GROUP} disabled={groupList.length === 0}>
                            Only group
                        </Radio>
                    </Radio.Group>
                </div>
                {presentAccess === Access.ONLY_GROUP && groupList.length > 0 && (
                    <Select
                        placeholder="Choose group to present"
                        onChange={(value) => setPresentTo(value)}
                        style={{ width: '100%' }}
                    >
                        {groupList.map((group: IGroup) => {
                            return <Select.Option value={group.id}>{group.name}</Select.Option>
                        })}
                    </Select>
                )}
            </div>
        </Modal>
    )
}
export default ChoosePresentType
