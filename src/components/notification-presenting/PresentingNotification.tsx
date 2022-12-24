import { CloseOutlined } from '@ant-design/icons'
import { failureModal } from 'components/modals'
import { IPresentation } from 'interfaces'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import { generatePresentationLink } from 'utils/presentation.util'
import styles from './styles.module.css'

const PresentingNotification = ({ presentationId }: { presentationId?: string }) => {
    const [presentation, setPresentation] = useState<IPresentation>({} as IPresentation)
    const [presentationPath, setPresentationPath] = useState('')
    const [presentationLink, setPresentationLink] = useState('')
    const [show, setShow] = useState(true)
    const fetchPresentation = async () => {
        try {
            const result = await instance.get(`/presentation/get/${presentationId}`)
            if (result.status === 200) {
                console.log('result', result.data)
                setPresentation(result.data)
            } else {
                failureModal('Get presentation failed', result.statusText)
            }
        } catch (error) {
            failureModal('Get presentation failed', error.response && error.response.data)
        }
    }
    useEffect(() => {
        if (presentationId) {
            fetchPresentation()
        }
    }, [presentationId])
    useEffect(() => {
        if (
            presentation &&
            presentation.inviteCode &&
            presentation.isPresenting &&
            presentation.slideList
        ) {
            const currentSlide = presentation?.slideList?.[presentation?.currentSlide ?? 0]
            if (currentSlide) {
                const { url, path } = generatePresentationLink(
                    presentation.inviteCode,
                    currentSlide.type,
                )
                setPresentationPath(path)
                setPresentationLink(url)
            }
        }
    }, [presentation])
    return (
        <div className={styles.notificationContainer}>
            {show && presentationPath && presentationLink && (
                <div className={styles.notification}>
                    <div className={styles.notificationText}>
                        Presentation is presenting{' '}
                        <Link to={presentationPath}>{presentationLink}</Link>
                    </div>
                    <div className={styles.notificationIcon}>
                        <CloseOutlined onClick={() => setShow(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}
export default PresentingNotification
