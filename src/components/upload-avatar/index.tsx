/* eslint-disable */
import { useState } from 'react'
import { FormInstance, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './index.css'
import { useMutation } from 'react-query'
import instance from '../../service/axiosPrivate'
import { failureModal } from '../modals'

function UploadAvatar({ formRef }: { formRef: FormInstance<any> }) {
    const [loading, setLoading] = useState(false)

    const handleUpload = (options: any) => {
        setLoading(true)
        mutate(options.file, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    setLoading(false)
                    formRef.setFieldValue('avatar', res.data.fileUrl)
                } else {
                    failureModal('Upload failed', res.data)
                }
            },
            onError: (error: any) => {
                setLoading(false)
                failureModal('Upload failed', error.response && error.response.data)
            },
        })
    }
    const { mutate } = useMutation((uploadData: any) => {
        // Create an object of formData
        const formData = new FormData()
        // Update the formData object
        formData.append('file', uploadData)
        return instance.post('/upload/upload-file', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    })

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    )

    return (
        <Upload name="avatar" listType="picture-card" className="avatar-uploader" showUploadList={false} customRequest={handleUpload}>
            {formRef.getFieldValue('avatar') ? (
                <img
                    src={formRef.getFieldValue('avatar')}
                    alt="avatar"
                    style={{
                        width: '100%',
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    )
}

export default UploadAvatar
