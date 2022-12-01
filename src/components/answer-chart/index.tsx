/* eslint-disable */
import { useContext, useEffect, useState } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SocketContext } from '../../service'
import { SocketEvent } from '../../service/socket/event'
import LoadingSpin from '../loading-spin'
import './index.css'

function AnswerChart() {
    const [data, setData] = useState<any>([
        { option: 'Great', answer: 1 },
        { option: 'Bad', answer: 2 },
        { option: 'Happy', answer: 0 },
    ])
    const socket = useContext(SocketContext)

    const handleUpdateResults = (results: any) => {
        setData([
            { option: 'Great', answer: 1 },
            { option: 'Bad', answer: 2 },
            { option: 'Happy', answer: 0 },
        ])
    }

    useEffect(() => {
        // Get initial results of slide
    }, [])

    useEffect(() => {
        socket.on(SocketEvent.UPDATE_RESULTS, handleUpdateResults)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.removeAllListeners()
        }
    }, [socket])

    return (
        <ResponsiveContainer width="80%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 20 }}
                // className="bar-chart"
            >
                <Bar dataKey="answer" fill="#82ca9d">
                    <LabelList
                        dataKey="answer"
                        position="top"
                        style={{ fontSize: '1.5em', fontWeight: 'bold' }}
                    />
                </Bar>
                <XAxis dataKey="option" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AnswerChart
