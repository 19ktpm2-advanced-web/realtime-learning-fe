/* eslint-disable */
import { ISlide } from 'interfaces'
import { Link } from 'react-router-dom'
import { config } from '../../config'
import AnswerChart from '../answer-chart'
import './index.css'

function Slide({ slide, code }: { slide: ISlide; code: string }) {
    return (
        <div className="slide-container">
            <div className="invitation-wrapper">
                <p>
                    Go to <Link to={'/'}>{config.BASE_URL}</Link> and use the code {code}
                </p>
            </div>
            <div className="question-wrapper">
                <h2>{slide.text}</h2>
            </div>
            <div className="chart-wrapper">
                <AnswerChart options={slide?.optionList ?? []} />
            </div>
        </div>
    )
}

export default Slide
