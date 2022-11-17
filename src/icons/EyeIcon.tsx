import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import React from 'react'

function EyeIcon(visible: boolean) {
    return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
}
export default EyeIcon
