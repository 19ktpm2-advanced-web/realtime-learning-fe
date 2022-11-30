import { useEffect, useState } from 'react'
import PresentationList from 'components/presentationList'
import { IPresentation } from 'interfaces'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import presentationSample from 'sample/presentations'
import styles from './styles.module.css'

function Presentation() {
    const [presentations, setPresentations] = useState<IPresentation[]>([])
    useEffect(() => {
        setPresentations(presentationSample)
    }, [])
    return (
        <div className={styles.container}>
            <div>My Presentations</div>
            <div className={styles.headerWrapper}>
                <Button
                    className={styles.addNewPresentationBtn}
                    icon={<PlusOutlined />}
                    type="primary"
                >
                    New presentation
                </Button>
            </div>
            <PresentationList presentations={presentations} />
        </div>
    )
}
export default Presentation
