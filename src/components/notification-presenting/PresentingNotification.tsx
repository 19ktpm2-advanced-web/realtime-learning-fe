import { CloseOutlined } from '@ant-design/icons'
import CustomAlert from 'components/custom-alert'
import { failureModal } from 'components/modals'
import { IPresentation } from 'interfaces'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SocketContext } from 'service'
import instance from 'service/axiosPrivate'
import { PresentationEvent } from 'service/socket/event'
import { generatePresentationLink } from 'utils/presentation.util'
import styles from './styles.module.css'

const PresentingNotification = ({
    presentationId,
    groupId,
}: {
    presentationId?: string
    groupId?: string
}) => {
    const socketService = useContext(SocketContext)
    const [presentation, setPresentation] = useState<IPresentation>({} as IPresentation)
    const [presentationPath, setPresentationPath] = useState('')
    const [presentationLink, setPresentationLink] = useState('')
    const [showAlert, setShowAlert] = useState(false)
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
        try {
            socketService.establishConnection()
        } catch (error) {
            failureModal(
                'Something is wrong with the socket! Please try to reload the page.',
                error,
            )
        }
        if (presentation.inviteCode && groupId) {
            socketService.socket.emit(PresentationEvent.JOIN_ROOM, {
                roomId: presentation.inviteCode,
            })
            socketService.socket.emit(PresentationEvent.JOIN_ROOM, {
                roomId: groupId,
            })
            socketService.socket.on(PresentationEvent.NEW_PRESENTING_IN_GROUP, () => {
                setShow(true)
                setShowAlert(true)
            })
            socketService.socket.on(PresentationEvent.END_PRESENTING, () => {
                setShow(false)
            })
        }
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socketService.socket.removeAllListeners()
            socketService.disconnect()
        }
    }, [socketService, presentation, presentationId, groupId])
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
                    groupId,
                )
                setPresentationPath(path)
                setPresentationLink(url)
            }
        }
    }, [presentation])
    return (
        <>
            <CustomAlert
                toastId={groupId}
                content={{ title: 'New presentation is presenting' }}
                visible={showAlert}
            />
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
        </>
    )
}
export default PresentingNotification
