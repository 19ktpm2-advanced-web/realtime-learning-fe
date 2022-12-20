import {
    ArrowLeftOutlined,
    CaretRightFilled,
    CheckOutlined,
    CloseOutlined,
    ExclamationCircleFilled,
    HolderOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import { Button, Divider, Empty, Form, Input, Modal, Select, Tabs } from 'antd'
import { failureModal, successModal } from 'components/modals'
import Slide from 'components/slide'
import SlideSetting from 'components/slideSetting'
import { IPresentation, ISlide } from 'interfaces'
import { useEffect, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useMutation } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function PresentationDetail() {
    const handleFullScreen = useFullScreenHandle()
    const navigate = useNavigate()
    const [presentation, setPresentation] = useState<IPresentation>({})
    const [slidePreview, setSlidePreview] = useState<ISlide>({})
    const [isDataChanging, setIsDataChange] = useState(false)
    const [slideListChanged, setSlideListChanged] = useState(false)
    const { id } = useParams<{ id: string }>()
    const [presentationForm] = Form.useForm()
    const { confirm } = Modal
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

                    setSlideListChanged(false)
                }
            })()
        }
    }, [id, slideListChanged])
    const [showDescInput, setShowDescInput] = useState(false)
    const handleNewSlideClick = async () => {
        const result = await instance.post('/presentation/slide/add', {
            presentationId: id,
            text: '',
            optionList: [],
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
            const result = await instance.put(`/presentation/edit/${presentation.id}`, data)
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
        if (slidePreview.id && slidePreview.id) {
            try {
                const result = await instance.put(`/presentation/slide/edit/${slidePreview.id}`, {
                    presentationId: presentation.id,
                    text: slidePreview.text,
                    optionList: slidePreview.optionList,
                })
                if (result.status === 200) {
                    setPresentation({
                        ...presentation,
                        slideList: result.data,
                    })
                } else {
                    failureModal('Update slide failed', result.data.message)
                }
            } catch (error) {
                failureModal('Update slide failed', error.response && error.response.data)
            }
        }
    }
    const saveClick = async () => {
        await presentationForm.submit()
        await handleSaveSlide()
        setIsDataChange(false)
    }

    const { mutate } = useMutation((startPresentingData) => {
        return instance.post('/presentation/slide/update-present-status', startPresentingData)
    })

    const handlePresentClick = async () => {
        const payload: any = {
            presentationId: presentation.id,
            slideId: slidePreview.id,
            isPresenting: true,
        }
        mutate(payload, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    handleFullScreen.enter()
                } else {
                    failureModal('Cannot load slide to present', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Something is wrong', error.response && error.response.data)
            },
        })
    }

    const { mutate: deleteSlideMutate } = useMutation(
        ({ presentationId, slideId }: { presentationId: string; slideId: string }) => {
            return instance.delete(`/presentation/slide/delete/${presentationId}&${slideId}`)
        },
    )

    const handleDeleteSlide = () => {
        const payload: any = {
            presentationId: presentation.id,
            slideId: slidePreview.id,
        }
        deleteSlideMutate(payload, {
            onSuccess: (res) => {
                if (res?.status === 200) {
                    setSlideListChanged(true)
                    setSlidePreview({})
                    successModal('Slide deleted successfully')
                } else {
                    failureModal('Something is wrong', res.statusText)
                }
            },
            onError: (error: any) => {
                failureModal('Something is wrong', error.response && error.response.data)
            },
        })
    }
    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this slide?',
            icon: <ExclamationCircleFilled />,
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteSlide()
            },
        })
    }

    const handleFullScreenChange = (state: boolean) => {
        setSlideListChanged(false)
        if (!state) {
            setSlideListChanged(true)
            const payload: any = {
                presentationId: presentation.id,
                slideId: slidePreview.id,
                isPresenting: false,
            }
            mutate(payload, {
                onSuccess: (res) => {
                    if (res?.status !== 200) failureModal('Something is wrong', res.statusText)
                },
                onError: (error: any) => {
                    failureModal('Something is wrong', error.response && error.response.data)
                },
            })
        }
    }

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
                                <p>{`Created By ${presentation.createBy?.fullName}`}</p>
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
                            {isDataChanging ? 'Save' : 'Saved'}
                        </Button>
                        <Divider type="vertical" />
                        <Button
                            className={styles.presentBtn}
                            type="primary"
                            icon={<CaretRightFilled />}
                            onClick={handlePresentClick}
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
                    <Form.Item name="description" className={styles.formItem}>
                        {!showDescInput ? (
                            <div
                                onClick={() => setShowDescInput(true)}
                                className={styles.description}
                            >
                                Add your description here
                            </div>
                        ) : (
                            <Input.TextArea
                                className={styles.descriptionInput}
                                onBlur={() => setShowDescInput(false)}
                                placeholder="Add your description here"
                                autoFocus
                            />
                        )}
                    </Form.Item>
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
                                <Slide
                                    slide={slide}
                                    code={presentation?.inviteCode ?? ''}
                                    isFullScreen={handleFullScreen.active}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.slideContent}>
                    <div className={styles.slidePreview}>
                        {slidePreview.id ? (
                            <FullScreen
                                className={styles.slidePreviewFullScreen}
                                handle={handleFullScreen}
                                onChange={handleFullScreenChange}
                            >
                                <Slide
                                    slide={slidePreview}
                                    code={presentation?.inviteCode ?? ''}
                                    isFullScreen={handleFullScreen.active}
                                />
                            </FullScreen>
                        ) : (
                            <Empty description="No slide preview" className={styles.emptyWrapper} />
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
                                    <SlideSetting
                                        slide={slidePreview}
                                        updateSlide={updateSlidePreview}
                                    />
                                    <Button
                                        className={styles.deleteSlideBtn}
                                        icon={<CloseOutlined />}
                                        onClick={showDeleteConfirm}
                                    >
                                        Delete slide
                                    </Button>
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
