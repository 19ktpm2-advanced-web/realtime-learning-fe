import {
    ArrowLeftOutlined,
    CaretRightFilled,
    CheckOutlined,
    CloseOutlined,
    HolderOutlined,
    PlusOutlined,
    QuestionOutlined,
} from '@ant-design/icons'
import { Button, Divider, Empty, Form, Input, Select, Tabs } from 'antd'
import { failureModal } from 'components/modals'
import Slide from 'components/slide'
import { IOption, IPresentation, ISlide } from 'interfaces'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function PresentationDetail() {
    const navigate = useNavigate()
    const [presentation, setPresentation] = useState<IPresentation>({})
    const [slidePreview, setSlidePreview] = useState<ISlide>({})
    const { id } = useParams<{ id: string }>()
    const [editForm] = Form.useForm()
    useEffect(() => {
        if (id) {
            ;(async () => {
                const result = await instance.get(`/presentation/get/${id}`)
                if (result.status === 200) {
                    setPresentation(result.data)
                    editForm.setFieldsValue(result.data)
                }
            })()
        }
    }, [id])
    const [showDescInput, setShowDescInput] = useState(false)
    const [options, setOptions] = useState<IOption[]>([])
    const onChangeOption = (value: string, index: number) => {
        const newOptions = [...options]
        newOptions[index].answer = value
        setOptions(newOptions)
    }

    const handleNewSlideClick = async () => {
        const result = await instance.post('/presentation/slide/add', {
            presentationId: id,
            text: '',
            options: [],
        })
        if (result.status === 200) {
            if (presentation.slideList) {
                setPresentation({
                    ...presentation,
                    slideList: [...presentation.slideList, result.data],
                })
            } else {
                setPresentation({
                    ...presentation,
                    slideList: [result.data],
                })
            }
        } else {
            failureModal('Create slide failed', result.data.message)
        }
    }
    const handleSaveClick = async () => {}
    return (
        <Form
            form={editForm}
            initialValues={presentation}
            className={styles.container}
            onFinish={handleSaveClick}
        >
            <div className={styles.header}>
                <div className={styles.leftWrapper}>
                    <ArrowLeftOutlined className={styles.backBtn} onClick={() => navigate(-1)} />
                    <div className={styles.titleWrapper}>
                        <Form.Item name="name" className={styles.formItem}>
                            <Input className={styles.titleInput} />
                        </Form.Item>
                        <div className={styles.createdBy}>Created By {presentation.createdBy}</div>
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
                <Button
                    className={styles.newSlideBtn}
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleNewSlideClick}
                >
                    New Slide
                </Button>
                {!showDescInput ? (
                    <div onClick={() => setShowDescInput(true)} className={styles.description}>
                        Add your description here
                    </div>
                ) : (
                    <Form.Item name="description" className={styles.formItem}>
                        <Input.TextArea
                            className={styles.descriptionInput}
                            onBlur={() => setShowDescInput(false)}
                            placeholder="Add your description here"
                            autoFocus
                        />
                    </Form.Item>
                )}
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.slideList}>
                    {presentation.slideList?.map((slide, index) => (
                        <div
                            className={styles.slideItemWrapper}
                            key={index}
                            onClick={() => setSlidePreview(slide)}
                        >
                            <div className={styles.slideIndex}>
                                {index + 1}
                                <HolderOutlined />
                            </div>
                            <div className={styles.slideItem}>
                                <Slide />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.slideContent}>
                    <div className={styles.slidePreview}>
                        {JSON.stringify(slidePreview) !== JSON.stringify({}) ? (
                            <Slide />
                        ) : (
                            <Empty description="No slide preview" />
                        )}
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
        </Form>
    )
}
export default PresentationDetail
