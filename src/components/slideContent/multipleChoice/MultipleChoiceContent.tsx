import AnswerChart from 'components/answer-chart'
import { failureModal } from 'components/modals'
import { IOption } from 'interfaces'
import { IMultipleChoiceSlide } from 'interfaces/slide'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from 'service'
import { PresentationEvent } from 'service/socket/event'
import styles from './styles.module.css'

function MultipleChoiceContent({ slide }: { slide: IMultipleChoiceSlide }) {
    const socketService = useContext(SocketContext)
    const [optionData, setOptionData] = useState<IOption[]>(slide?.optionList ?? [])
    useEffect(() => {
        if (slide?.optionList) {
            setOptionData(slide.optionList)
        }
    }, [slide])
    const handleUpdateResults = (result: { slide: IMultipleChoiceSlide }) => {
        setOptionData(result.slide.optionList || [])
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

        // Each user watching the same presentation will join the same room
        socketService.socket.on(PresentationEvent.UPDATE_RESULTS, handleUpdateResults)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socketService.socket.removeAllListeners()
            socketService.disconnect()
        }
    }, [socketService, socketService.socket])
    return (
        <>
            <div className={styles.questionWrapper}>
                <h2>{slide.text}</h2>
            </div>
            <div className={styles.chartWrapper}>
                {slide.optionList && slide.optionList.length > 0 && (
                    <AnswerChart options={optionData} />
                )}
            </div>
        </>
    )
}
export default MultipleChoiceContent
