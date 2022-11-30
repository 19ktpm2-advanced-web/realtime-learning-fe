import { useEffect, useState } from 'react'
import PresentationList from 'components/presentationList'
import { IPresentation } from 'interfaces'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import presentationSample from 'sample/presentations'

function Presentation() {
    const [presentations, setPresentations] = useState<IPresentation[]>([])
    useEffect(() => {
        setPresentations(presentationSample)
    }, [])
    return (
        <div>
            <div>My Presentations</div>
            <Button icon={<PlusOutlined />}>New presentation</Button>
            <PresentationList presentations={presentations} />
        </div>
    )
}
export default Presentation
