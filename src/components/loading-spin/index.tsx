/* eslint-disable */
import { Spin } from 'antd'
import './index.css'
import { LoadingOutlined } from '@ant-design/icons'

function LoadingSpin() {
    return (
        <div className="loading-spin-wrapper">
            <Spin indicator={<LoadingOutlined />} />
        </div>
    )
}

export default LoadingSpin
