/* eslint-disable */
import { Link } from 'react-router-dom'
import { config } from '../../config'
import AnswerChart from '../answer-chart'
import './index.css'

function Slide() {
    return (
        <div className="slide-container">
            <div className="invitation-wrapper">
                <p>
                    Go to <Link to={'/'}>{config.BASE_URL}</Link> and use the code 66 44 92 8
                </p>
            </div>
            <div className="question-wrapper">
                <h2>
                    Are you OK? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda
                    est, illo nemo laborum dolorem alias enim unde perferendis. Magni rerum commodi
                    itaque optio autem quas inventore vel ipsam repellendus quibusdam!
                </h2>
            </div>
            <div className="chart-wrapper">
                <AnswerChart />
            </div>
        </div>
    )
}

export default Slide
