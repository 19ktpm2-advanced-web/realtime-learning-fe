import { Modal, Select, Switch } from 'antd'
import { failureModal } from 'components/modals'
import { Access } from 'enums'
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
    const [groupId, setGroupList] = useState<IGroup[]>([])
    const fetchGroupList = async () => {
        try {
            const resultJoined = await instance.get('/group/groupJoined')

            if (resultJoined.status === 200) {
                setGroupList(resultJoined.data.groups)
            }
            const result = await instance.get('/group/getOwn')
            if (result.status === 200) {
                setGroupList((prev) => {
                    if (prev && prev.length > 0) {
                        const diff = result.data.groups.filter((group: IGroup) => {
                            return !prev.find((prevGroup: IGroup) => prevGroup.id === group.id)
                        })
                        return [...prev, ...diff]
                    }
                    return result.data.groups
                })
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
                    <span className={styles.accessTitle}>
                        {presentAccess === Access.PUBLIC ? 'Present Public' : 'Present In Group'}
                    </span>
                    <Switch
                        onChange={(checked) =>
                            setPresentAccess(!checked ? Access.PUBLIC : Access.ONLY_GROUP)
                        }
                        defaultChecked={presentAccess !== Access.PUBLIC}
                    />
                </div>
                {presentAccess === Access.ONLY_GROUP && groupId.length > 0 && (
                    <Select
                        placeholder="Choose group to present"
                        onChange={(value) => setPresentTo(value)}
                        style={{ width: '100%' }}
                    >
                        {groupId.map((group: IGroup) => {
                            return <Select.Option value={group.id}>{group.name}</Select.Option>
                        })}
                    </Select>
                )}
            </div>
        </Modal>
    )
}
export default ChoosePresentType
