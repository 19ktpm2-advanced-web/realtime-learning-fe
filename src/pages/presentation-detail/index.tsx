import {
    ArrowLeftOutlined,
    CaretRightFilled,
    CheckOutlined,
    CloseOutlined,
    PlusOutlined,
    QuestionOutlined,
} from '@ant-design/icons'
import { Button, Divider, Input, Select, Tabs } from 'antd'
import Slide from 'components/slide'
import { IOption } from 'interfaces'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './styles.module.css'

function PresentationDetail() {
    const { id } = useParams<{ id: string }>()
    console.log(id)
    const [showDescInput, setShowDescInput] = useState(false)
    const [options, setOptions] = useState<IOption[]>([])
    const onChangeOption = (value: string, index: number) => {
        const newOptions = [...options]
        newOptions[index].answer = value
        setOptions(newOptions)
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.leftWrapper}>
                    <ArrowLeftOutlined className={styles.backBtn} />
                    <div className={styles.titleWrapper}>
                        <div className={styles.title}>Presentation Name</div>
                        <div className={styles.createdBy}>Created By bahuy3103</div>
                    </div>
                </div>
                <div className={styles.rightHeader}>
                    <Button className={styles.saveBtn} icon={<CheckOutlined />}>
                        Save
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        className={styles.presentBtn}
                        type="primary"
                        icon={<CaretRightFilled />}
                    >
                        Present
                    </Button>
                </div>
            </div>
            <div className={styles.navBar}>
                <Button className={styles.newSlideBtn} icon={<PlusOutlined />} type="primary">
                    New Slide
                </Button>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.slideList}>
                    <div className={styles.slideItem}>
                        <Slide />
                    </div>
                </div>
                <div className={styles.slideContent}>
                    <div className={styles.slidePreview}>
                        <Slide />
                    </div>
                </div>
                <div className={styles.slideSetting}>
                    <div className={styles.settingHeader}>
                        <label className={styles.settingLabel}> Slide Type </label>
                        <Select className={styles.selectType} defaultValue="multiple-choice">
                            <Select.Option value="multiple-choice">Multiple Choice</Select.Option>
                        </Select>
                    </div>
                    <div className={styles.settingContent}>
                        <Tabs className={styles.tabWrapper} defaultActiveKey="content">
                            <Tabs.TabPane tab="Content" key="content">
                                <div className={styles.settingContentWrapper}>
                                    {!showDescInput && (
                                        <div
                                            onClick={() => setShowDescInput(true)}
                                            className={styles.description}
                                        >
                                            {' '}
                                            Add your description here{' '}
                                        </div>
                                    )}
                                    {showDescInput && (
                                        <Input.TextArea
                                            className={styles.descriptionInput}
                                            onBlur={() => setShowDescInput(false)}
                                            placeholder="Add your description here"
                                            autoFocus
                                        />
                                    )}
                                </div>
                                <div className={styles.settingContentWrapper}>
                                    <label className={styles.settingLabel}>
                                        Your Question
                                        <span>
                                            <QuestionOutlined />
                                        </span>
                                    </label>
                                    <Input
                                        placeholder="Question here ..."
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
                                    {options.map((option, index) => {
                                        return (
                                            <div className={styles.optionItem} key={index}>
                                                <Input
                                                    placeholder="Option here ..."
                                                    className={styles.inputOption}
                                                    defaultValue={option.answer}
                                                    onChange={(e) => {
                                                        onChangeOption(e.target.value, index)
                                                    }}
                                                />
                                                <CloseOutlined
                                                    className={styles.deleteOption}
                                                    onClick={() => {
                                                        const newOptions = options.filter(
                                                            (item, i) => i !== index,
                                                        )
                                                        setOptions(newOptions)
                                                    }}
                                                />
                                            </div>
                                        )
                                    })}
                                    <Button
                                        className={styles.addOptionBtn}
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            setOptions([...options, { answer: '', votes: 0 }])
                                        }
                                    >
                                        Add Option
                                    </Button>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Customize" key="customize">
                                Have not supported yet
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PresentationDetail
