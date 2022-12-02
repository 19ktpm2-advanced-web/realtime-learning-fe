/* eslint-disable */
import { IOption, ISlide } from 'interfaces'
import { useEffect, useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { config } from '../../config'
import AnswerChart from '../answer-chart'
import './index.css'

function Slide({ slide, code }: { slide: ISlide; code: string }) {
    const [data, setData] = useState<ISlide>({})
    const [options, setOptions] = useState<IOption[]>([])
    useEffect(() => {
        setData(slide)
        console.log('options in Slide', slide.optionList)
        if (slide.optionList) {
            console.log('Set options')
            setOptions(slide.optionList)
        }
    }, [slide])
    return (
        <div className="slide-container">
            <div className="invitation-wrapper">
                <p>
                    Go to <Link to={'/'}>{config.BASE_URL}</Link> and use the code {code}
                </p>
            </div>
            <div className="question-wrapper">
                <h2>{data.text}</h2>
            </div>
            <div className="chart-wrapper">
                <AnswerChart options={options} />
            </div>
        </div>
    )
}

export default memo(Slide)
