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
import { IPresentation, ISlide } from 'interfaces'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function PresentationDetail() {
    const navigate = useNavigate()
    const [presentation, setPresentation] = useState<IPresentation>({})
    const [slidePreview, setSlidePreview] = useState<ISlide>({})
    const { id } = useParams<{ id: string }>()
    const [presentationForm] = Form.useForm()
    const [slideForm] = Form.useForm()
    useEffect(() => {
        if (id) {
            ;(async () => {
                const result = await instance.get(`/presentation/get/${id}`)
                if (result.status === 200) {
                    setPresentation(result.data)
                    presentationForm.setFieldsValue(result.data)
                }
            })()
        }
    }, [id])
    const [showDescInput, setShowDescInput] = useState(false)
    const onChangeOption = (value: string, index: number) => {
        const newOptions = slidePreview.optionList ?? []
        if (newOptions[index]) {
            newOptions[index].answer = value
            newOptions[index].votes = 0
            setSlidePreview({ ...slidePreview, optionList: newOptions })
        }
    }
    console.log('presentation', presentation)
    console.log('slidePreview', slidePreview)

    const handleNewSlideClick = async () => {
        const result = await instance.post('/presentation/slide/add', {
            presentationId: id,
            text: '',
            options: [],
        })
        if (result.status === 200) {
            if (presentation.slideList) {
                setPresentation(result.data)
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
    console.log('slidePreview', slidePreview)
    const handleSavePresentation = async () => {}
    const handleSaveSlide = async () => {}
    return (
        <div className={styles.container}>
            <Form
                form={presentationForm}
                initialValues={presentation}
                onFinish={handleSavePresentation}
            >
                <div className={styles.header}>
                    <div className={styles.leftWrapper}>
                        <ArrowLeftOutlined
                            className={styles.backBtn}
                            onClick={() => navigate(-1)}
                        />
                        <div className={styles.titleWrapper}>
                            <Form.Item name="name" className={styles.formItem}>
                                <Input className={styles.titleInput} />
                            </Form.Item>
                            <div className={styles.createdBy}>
                                Created By {presentation.createdBy}
                            </div>
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
            </Form>
            <div className={styles.contentWrapper}>
                <div className={styles.slideList}>
                    {presentation.slideList?.map((slide, index) => (
                        <div
                            className={`${styles.slideItemWrapper} ${
                                slidePreview.id === slide.id ? styles.active : ''
                            }`}
                            key={index}
                            onClick={() => setSlidePreview(slide)}
                        >
                            <div className={styles.slideIndex}>
                                {index + 1}
                                <HolderOutlined />
                            </div>
                            <div className={styles.slideItem}>
                                <Slide slide={slide} code={presentation?.inviteCode ?? ''} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.slideContent}>
                    <div className={styles.slidePreview}>
                        {slidePreview.id ? (
                            <Slide slide={slidePreview} code={presentation?.inviteCode ?? ''} />
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
                                <Form
                                    form={slideForm}
                                    onFinish={handleSaveSlide}
                                    initialValues={slidePreview}
                                >
                                    <div className={styles.settingContentWrapper}>
                                        <label className={styles.settingLabel}>
                                            Your Question
                                            <span>
                                                <QuestionOutlined />
                                            </span>
                                        </label>
                                        <Form.Item name="text" className={styles.formItem}>
                                            <Input
                                                placeholder="Question here ..."
                                                className={styles.inputQuestion}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className={styles.settingContentWrapper}>
                                        <label className={styles.settingLabel}>
                                            Options
                                            <span>
                                                <QuestionOutlined />
                                            </span>
                                        </label>
                                        {slidePreview?.optionList?.map((option, index) => {
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
                                                            setSlidePreview((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    optionList:
                                                                        prev?.optionList?.filter(
                                                                            (item, i) =>
                                                                                i !== index,
                                                                        ),
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            )
                                        })}
                                        <Button
                                            className={styles.addOptionBtn}
                                            icon={<PlusOutlined />}
                                            onClick={() =>
                                                setSlidePreview((slidePrev) => {
                                                    const newOptions = slidePrev?.optionList ?? []
                                                    newOptions.push({ answer: '' })
                                                    return {
                                                        ...slidePrev,
                                                        optionList: newOptions,
                                                    }
                                                })
                                            }
                                        >
                                            Add Option
                                        </Button>
                                    </div>
                                </Form>
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
