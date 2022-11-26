import { EditOutlined } from '@ant-design/icons'
import { Avatar, Button, Image, Upload } from 'antd'
import { failureModal } from 'components/modals'
import { IGroup } from 'interfaces/group/group.interface'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function GroupGeneral({ groupId }: { groupId?: String }) {
    const [group, setGroup] = useState<IGroup>()
    const [loading, setLoading] = useState(false)
    const { mutate } = useMutation((uploadData: any) => {
        const formData = new FormData()
        formData.append('file', uploadData)
        return instance.post('/upload/upload-file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    })
    const uploadBackgroundImg = (options: any) => {
        setLoading(true)
        mutate(options.file, {
            onSuccess: async (res) => {
                if (res?.status === 200) {
                    try {
                        const result = await instance.put(`/group/edit/${groupId}`, {
                            background: res.data.fileUrl,
                        })
                        if (result.status === 200) {
                            setGroup(result.data)
                        } else {
                            failureModal('Upload failed', result.data)
                        }
                    } catch (error) {
                        console.error(error)
                        failureModal('Upload failed', error.response && error.response.data)
                    }
                } else {
                    failureModal('Upload failed', res.data)
                }
                setLoading(false)
            },
            onError: (error: any) => {
                console.error(error)
                setLoading(false)
                failureModal('Upload failed', error.response && error.response.data)
            },
        })
    }

    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        if (res.status === 200) {
            setGroup(res.data.group)
        } else {
            failureModal('Failed to get group detail', res.statusText)
        }
    })
    return (
        <div className={styles.wrapper}>
            <div className={styles.bannerWrapper}>
                <Image preview={false} className={styles.banner} src={group?.background} />
                <span className={styles.editButtonWrapper}>
                    <Upload
                        listType="picture"
                        showUploadList={false}
                        customRequest={uploadBackgroundImg}
                    >
                        <Button
                            loading={loading}
                            className={styles.editBtn}
                            icon={<EditOutlined />}
                        >
                            Edit
                        </Button>
                    </Upload>
                </span>
                <span className={styles.avatarWrapper}>
                    <Avatar className={styles.avatar} src={group?.avatar} />
                </span>
            </div>
            <div className={styles.contentWrapper}>
                <h2 className="">{group?.name}</h2>
                <p>{group?.description}</p>
                <p>Owner by: {group?.owner?.fullName}</p>
            </div>
        </div>
    )
}
export default GroupGeneral
