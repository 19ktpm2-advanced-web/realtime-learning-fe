import { IOption, ISlide } from 'interfaces'
import { useEffect, useState, memo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { SocketContext } from '../../service'
import { SocketEvent } from '../../service/socket/event'
import { generatePresentationLink } from '../../utils/presentation.util'
import AnswerChart from '../answer-chart'
import { failureModal } from '../modals'
import './index.css'

function Slide({ slide, code }: { slide: ISlide; code: string }) {
    const socketService = useContext(SocketContext)
    const [optionData, setOptionData] = useState<IOption[]>(slide?.optionList ?? [])
    useEffect(() => {
        if (slide?.optionList) {
            setOptionData(slide.optionList)
        }
    }, [slide])
    const handleUpdateResults = (results: IOption[]) => {
        setOptionData(results)
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
        socketService.socket.emit(SocketEvent.JOIN_ROOM, {
            roomId: code,
        })
        socketService.socket.on(SocketEvent.UPDATE_RESULTS, handleUpdateResults)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socketService.socket.removeAllListeners()
            socketService.disconnect()
        }
    }, [socketService.socket])

    return (
        <div className="slide-container">
            <div className="invitation-wrapper">
                <p>
                    Share link: <Link to="/">{generatePresentationLink(code)}</Link>
                </p>
            </div>
            <div className="question-wrapper">
                <h2>{slide.text}</h2>
            </div>
            <div className="chart-wrapper">
                <AnswerChart options={optionData} />
            </div>
        </div>
    )
}

export default memo(Slide)
