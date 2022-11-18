import React, { useState } from 'react'
import { Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './index.css'

function UploadAvatar() {
    const [loading, setLoading] = useState(false)
    const [imageUrl] = useState()

    const beforeUpload = (file: any) => {
        console.log(file)
    }
    const handleChange = (info: any) => {
        console.log(info)
        if (info.file.status === 'uploading') {
            setLoading(true)
        }
        // if (info.file.status === "done") {
        // }
    }
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
        <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={() => {
                console.log('a')
            }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
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
