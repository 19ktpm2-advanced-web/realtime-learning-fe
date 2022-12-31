import { IOption } from 'interfaces'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis } from 'recharts'
// import LoadingSpin from '../loading-spin'
import './index.css'
import { useEffect, useState } from 'react'
import UserAnswerModal from 'components/user-answer-modal'
import instance from 'service/axiosPrivate'
import { failureModal } from 'components/modals'
import { Role } from 'enums'

function AnswerChart({
    slideId,
    options,
    presentationCode,
    groupId,
}: {
    slideId: string
    options: IOption[]
    presentationCode: string
    groupId: string
}) {
    const [selectedOptionId, setSelectedOptionId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isOwnerRole, setIsOwnerRole] = useState(false)
    const combineAnswer = options.reduce((acc, option) => {
        return `${acc}-${option.answer}`
    }, '')

    useEffect(() => {
        if (presentationCode && groupId) {
            try {
                ;(async () => {
                    const response = await instance.get(`/group/role/${groupId}`)
                    if (response.status === 200) {
                        if (
                            response.data &&
                            (response.data.role === Role.ADMINISTRATOR ||
                                response.data.role === Role.CO_ADMINISTRATOR)
                        )
                            setIsOwnerRole(true)
                    } else {
                        failureModal('Something went wrong')
                    }
                })()
            } catch (e) {
                failureModal(e)
            }
        }
    }, [groupId])

    return (
        <>
            <ResponsiveContainer
                width="80%"
                height="100%"
                key={`${options.length}-${combineAnswer}`}
            >
                <BarChart
                    data={options}
                    margin={{ top: 20, bottom: 20 }}
                    // className="bar-chart"
                >
                    <Bar
                        dataKey="votes"
                        fill="#82ca9d"
                        onClick={(elem) => {
                            if (elem.id && isOwnerRole) {
                                setSelectedOptionId(elem.id)
                                setIsModalOpen(true)
                            }
                        }}
                    >
                        <LabelList
                            dataKey="votes"
                            position="top"
                            style={{ fontSize: '1.5em', fontWeight: 'bold' }}
                        />
                    </Bar>
                    <XAxis dataKey="answer" style={{ fontSize: '2.5em', fontWeight: 'bold' }} />
                </BarChart>
            </ResponsiveContainer>
            <UserAnswerModal
                slideId={slideId}
                optionId={selectedOptionId || ''}
                isModalOpen={isModalOpen}
                handleClose={() => {
                    setIsModalOpen(false)
                    setSelectedOptionId(null)
                }}
            />
        </>
    )
}

export default AnswerChart
