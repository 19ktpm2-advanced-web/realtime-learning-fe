import React from 'react'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

function EyeIcon(visible: boolean) {
    return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
}
export default EyeIcon
