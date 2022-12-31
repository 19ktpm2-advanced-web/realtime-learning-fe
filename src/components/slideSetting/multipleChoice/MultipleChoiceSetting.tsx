import { CloseOutlined, PlusOutlined, QuestionOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { IMultipleChoiceSlide, IOption } from 'interfaces'
import styles from './styles.module.css'

function MultipleChoiceSetting({
    slide,
    updateSlide,
}: {
    slide: IMultipleChoiceSlide
    updateSlide: (slide: IMultipleChoiceSlide) => void
}) {
    const onChangeOption = (value: string, index: number) => {
        const newOptions: IOption[] = slide.optionList ?? []
        newOptions[index].answer = value
        newOptions[index].votes = 0
        updateSlide({ ...slide, optionList: newOptions })
    }
    return (
        <>
            <div className={styles.settingContentWrapper}>
                <label className={styles.settingLabel}>
                    Your Question
                    <span>
                        <QuestionOutlined />
                    </span>
                </label>
                <Input
                    placeholder="Question here ..."
                    value={slide?.text ?? ''}
                    onChange={(e) => {
                        updateSlide({
                            ...slide,
                            text: e.target.value,
                        })
                    }}
                    className={styles.inputQuestion}
                />
            </div>
            <div className={styles.settingContentWrapper}>
                <label className={styles.settingLabel}>
                    Options
                    <span>
                        <QuestionOutlined />
                    </span>
                </label>
                {slide?.optionList?.map((option, index) => {
                    return (
                        <div className={styles.optionItem} key={index}>
                            <Input
                                placeholder="Option here ..."
                                className={styles.inputOption}
                                value={option?.answer ?? ''}
                                onChange={(e) => {
                                    onChangeOption(e.target.value, index)
                                }}
                            />
                            <CloseOutlined
                                className={styles.deleteOption}
                                onClick={() => {
                                    updateSlide({
                                        ...slide,
                                        optionList: slide?.optionList?.filter(
                                            (item) => item !== option,
                                        ),
                                    })
                                }}
                            />
                        </div>
                    )
                })}
                <Button
                    className={styles.addOptionBtn}
                    icon={<PlusOutlined />}
                    onClick={() => {
                        const newOptions = slide?.optionList ?? []
                        newOptions.push({
                            answer: '',
                            votes: 0,
                            answerInfos: [],
                        })
                        updateSlide({
                            ...slide,
                            optionList: newOptions,
                        })
                    }}
                >
                    Add Option
                </Button>
            </div>
        </>
    )
}
export default MultipleChoiceSetting
