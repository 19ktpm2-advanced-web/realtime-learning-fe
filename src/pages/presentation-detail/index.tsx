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
    const [isDataChanging, setIsDataChange] = useState(false)
    const { id } = useParams<{ id: string }>()
    const [presentationForm] = Form.useForm()
    const updateSlidePreview = (slide: ISlide) => {
        setIsDataChange(true)
        setSlidePreview(slide)
    }
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
        const newOptions: IOption[] = slidePreview.optionList ?? []
        newOptions[index].answer = value
        newOptions[index].votes = 0
        updateSlidePreview({ ...slidePreview, optionList: newOptions })
    }
    const handleNewSlideClick = async () => {
        const result = await instance.post('/presentation/slide/add', {
            presentationId: id,
            text: '',
            options: [],
        })
        if (result.status === 200) {
            const newSlide = result.data[result.data.length - 1]
            if (presentation.slideList) {
                setPresentation({
                    ...presentation,
                    slideList: [...presentation.slideList, newSlide],
                })
            } else {
                setPresentation({
                    ...presentation,
                    slideList: [newSlide],
                })
            }
        } else {
            failureModal('Create slide failed', result.data.message)
        }
    }
    const handleSavePresentation = async (data: { name?: string; description?: string }) => {
        try {
            const result = await instance.post(`/presentation/edit/${presentation.id}`, data)
            if (result.status === 200) {
                setPresentation(result.data)
            } else {
                failureModal('Update presentation failed', result.data.message)
            }
        } catch (error) {
            failureModal('Update presentation failed', error.response && error.response.data)
        }
    }
    useEffect(() => {
        if (slidePreview.id) {
            setPresentation((prev) => ({
                ...prev,
                slideList: prev.slideList?.map((slide) => {
                    if (slide.id === slidePreview.id) {
                        return slidePreview
                    }
                    return slide
                }),
            }))
        }
    }, [slidePreview])
    const handleSaveSlide = async () => {
        try {
            const result = await instance.post(`/presentation/slide/edit/${slidePreview.id}`, {
                text: slidePreview.text,
                options: slidePreview.optionList,
            })
            if (result.status === 200) {
                setPresentation(result.data)
            } else {
                failureModal('Update slide failed', result.data.message)
            }
        } catch (error) {
            failureModal('Update slide failed', error.response && error.response.data)
        }
    }
    const saveClick = async () => {
        await presentationForm.submit()
        await handleSaveSlide()
        setIsDataChange(false)
    }
    console.log('slidePreview', slidePreview)
    return (
        <div className={styles.container}>
            <Form
                form={presentationForm}
                initialValues={presentation}
                onFinish={handleSavePresentation}
                onChange={() => {
                    setIsDataChange(true)
                }}
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
                        <Button
                            disabled={!isDataChanging}
                            className={styles.saveBtn}
                            icon={!isDataChanging && <CheckOutlined />}
                            type={isDataChanging ? 'primary' : 'default'}
                            onClick={saveClick}
                        >
                            {isDataChanging ? 'UnSave' : 'Saved'}
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

                {slidePreview.id && (
                    <div className={styles.slideSetting}>
                        <div className={styles.settingHeader}>
                            <label className={styles.settingLabel}> Slide Type </label>
                            <Select className={styles.selectType} defaultValue="multiple-choice">
                                <Select.Option value="multiple-choice">
                                    Multiple Choice
                                </Select.Option>
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
                                            value={slidePreview?.text ?? ''}
                                            onChange={(e) => {
                                                updateSlidePreview({
                                                    ...slidePreview,
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
                                        {slidePreview?.optionList?.map((option, index) => {
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
                                                            updateSlidePreview({
                                                                ...slidePreview,
                                                                optionList:
                                                                    slidePreview?.optionList?.filter(
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
                                                const newOptions = slidePreview?.optionList ?? []
                                                newOptions.push({
                                                    answer: '',
                                                    votes: 0,
                                                })
                                                updateSlidePreview({
                                                    ...slidePreview,
                                                    optionList: newOptions,
                                                })
                                            }}
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
                )}
            </div>
        </div>
    )
}
export default PresentationDetail
