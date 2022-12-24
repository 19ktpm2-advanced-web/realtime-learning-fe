import { Checkbox, Modal, Radio } from 'antd'
import { failureModal } from 'components/modals'
import { Access } from 'enums'
import { IGroup, IPresentation, ISlide } from 'interfaces'
import { useEffect, useState } from 'react'
import { FullScreenHandle } from 'react-full-screen'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

const ChoosePresentType = ({
    presentation,
    slide,
    isOpen,
    setIsOpen,
    handleFullScreen,
}: {
    presentation: IPresentation
    slide: ISlide
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    handleFullScreen: FullScreenHandle
}) => {
    const [presentAccess, setPresentAccess] = useState<Access>(Access.PUBLIC)
    const [presentTo, setPresentTo] = useState<string[]>([])
    const [groupList, setGroupList] = useState<IGroup[]>([])
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
            presentTo, // Group id list
        }
        try {
            const res = await instance.post('/presentation/slide/update-present-status', payload)
            if (res?.status === 200) {
                handleFullScreen.enter()
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
            <div className={styles.presentAccessWrapper}>
                <div className={styles.presentAccessItem}>
                    <Radio
                        checked={presentAccess === Access.PUBLIC}
                        onChange={() => setPresentAccess(Access.PUBLIC)}
                    >
                        Public
                    </Radio>
                </div>
                <div className={styles.presentAccessItem}>
                    <Radio
                        checked={presentAccess === Access.ONLY_GROUP}
                        onChange={() => setPresentAccess(Access.ONLY_GROUP)}
                    >
                        Only group
                    </Radio>
                </div>
                {presentAccess === Access.ONLY_GROUP &&
                    groupList.length > 0 &&
                    groupList.map((group: IGroup) => {
                        return (
                            <div className={styles.presentAccessItem}>
                                <Checkbox
                                    checked={presentTo.includes(group.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPresentTo((prev) => [...prev, group.id])
                                        } else {
                                            setPresentTo((prev) =>
                                                prev.filter((groupId) => groupId !== group.id),
                                            )
                                        }
                                    }}
                                >
                                    {group.name}
                                </Checkbox>
                            </div>
                        )
                    })}
            </div>
        </Modal>
    )
}
export default ChoosePresentType
