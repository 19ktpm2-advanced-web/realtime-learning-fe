import { IOption } from 'interfaces'
import { useEffect } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis } from 'recharts'
// import LoadingSpin from '../loading-spin'
import './index.css'

function AnswerChart({ options }: { options: IOption[] }) {
    useEffect(() => {
        // Get initial results of slide
    }, [])

    return (
        <ResponsiveContainer width="80%" height="100%" key={Math.random()}>
            <BarChart
                data={options}
                margin={{ top: 20 }}
                // className="bar-chart"
            >
                <Bar dataKey="votes" fill="#82ca9d">
                    <LabelList
                        dataKey="votes"
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
