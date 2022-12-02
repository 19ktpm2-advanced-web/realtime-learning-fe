import { IOption } from 'interfaces'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis } from 'recharts'
// import LoadingSpin from '../loading-spin'
import './index.css'

function AnswerChart({ options }: { options: IOption[] }) {
    const combineAnswer = options.reduce((acc, option) => {
        return `${acc}-${option.answer}`
    }, '')
    return (
        <ResponsiveContainer width="80%" height="100%" key={`${options.length}-${combineAnswer}`}>
            <BarChart
                data={options}
                margin={{ top: 20 }}
                // className="bar-chart"
            >
                <Bar dataKey="vote" fill="#82ca9d">
                    <LabelList
                        dataKey="vote"
                        position="top"
                        style={{ fontSize: '1.5em', fontWeight: 'bold' }}
                    />
                </Bar>
                <XAxis dataKey="answer" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AnswerChart
