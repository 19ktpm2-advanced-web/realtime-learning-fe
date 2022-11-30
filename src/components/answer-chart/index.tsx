/* eslint-disable */
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import LoadingSpin from '../loading-spin'
import './index.css'

function AnswerChart() {
    const data = [
        { option: 'Great', answer: 1 },
        { option: 'Bad', answer: 2 },
        { option: 'Happy', answer: 0 },
    ]

    return (
        <ResponsiveContainer width="80%" height={400}>
            <BarChart data={data} margin={{ top: 20 }}>
                <Bar dataKey="answer" fill="#82ca9d">
                    <LabelList dataKey="answer" position="top" />
                </Bar>
                <XAxis dataKey="option" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AnswerChart
