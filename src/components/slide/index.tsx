import { IOption, ISlide } from 'interfaces'
import { useEffect, useState, memo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { config } from '../../config'
import { SocketContext } from '../../service'
import { SocketEvent } from '../../service/socket/event'
import AnswerChart from '../answer-chart'
import './index.css'

function Slide({ slide, code }: { slide: ISlide; code: string }) {
    const socket = useContext(SocketContext)
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
        socket.on(SocketEvent.UPDATE_RESULTS, handleUpdateResults)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.removeAllListeners()
        }
    }, [socket])
    return (
        <div className="slide-container">
            <div className="invitation-wrapper">
                <p>
                    Go to <Link to="/">{config.BASE_URL}</Link> and use the code {code}
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
