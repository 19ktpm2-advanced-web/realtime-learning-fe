import { failureModal } from 'components/modals'
import { IPresentation } from 'interfaces'
import { useEffect, useState } from 'react'
import instance from 'service/axiosPrivate'
import { generateInvitationLink } from 'utils'
import styles from './styles.module.css'

const PresentingNotification = ({ presentationId }: { presentationId?: string }) => {
    const [presentation, setPresentation] = useState<IPresentation>({} as IPresentation)
    const fetchPresentation = async () => {
        try {
            const result = await instance.get(`/presentation/get/${presentationId}`)
            if (result.status === 200) {
                setPresentation(result.data.presentation)
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
    return (
        <div className={styles.container}>
            <div className={styles.notification}>
                <div className={styles.notificationTitle}>
                    {presentation.inviteCode
                        ? `Presentation is presenting ${generateInvitationLink(
                              presentation.inviteCode,
                          )}`
                        : null}
                </div>
            </div>
        </div>
    )
}
export default PresentingNotification
