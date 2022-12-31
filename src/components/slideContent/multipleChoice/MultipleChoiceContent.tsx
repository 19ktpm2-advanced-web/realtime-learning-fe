import AnswerChart from 'components/answer-chart'
import { IOption } from 'interfaces'
import { IMultipleChoiceSlide } from 'interfaces/slide'
import { useEffect, useState } from 'react'
import styles from './styles.module.css'

function MultipleChoiceContent({
    slide,
    presentationCode,
    groupId,
}: {
    slide: IMultipleChoiceSlide
    presentationCode: string
    groupId: string
}) {
    const [optionData, setOptionData] = useState<IOption[]>(slide?.optionList ?? [])
    useEffect(() => {
        if (slide?.optionList) {
            setOptionData(slide.optionList)
        }
    }, [slide])

    return (
        <>
            <div className={styles.questionWrapper}>
                <h2>{slide.text}</h2>
            </div>
            <div className={styles.chartWrapper}>
                {slide.optionList && slide.optionList.length > 0 && (
                    <AnswerChart
                        slideId={slide.id || ''}
                        options={optionData}
                        presentationCode={presentationCode}
                        groupId={groupId || ''}
                    />
                )}
            </div>
        </>
    )
}
export default MultipleChoiceContent
