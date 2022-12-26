/* eslint-disable */
import {
    ArrowLeftOutlined,
    CaretRightFilled,
    CheckOutlined,
    CloseOutlined,
    ExclamationCircleFilled,
    HolderOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import { Button, Card, Divider, Empty, Form, Input, Modal, Popover, Select, Tabs } from 'antd'
import ChoosePresentType from 'components/choose-present-type'
import { failureModal, successModal } from 'components/modals'
import Slide from 'components/slide'
import SlideSetting from 'components/slideSetting'
import { Access, SlideType } from 'enums'
import {
    IHeadingSlide,
    IMultipleChoiceSlide,
    IParagraphSlide,
    IPresentation,
    ISlide,
} from 'interfaces'
import { useEffect, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import InfiniteScroll from 'react-infinite-scroller'
import { useMutation } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

const PAGE_SIZE = 10
function PresentationDetail() {
    const handleFullScreen = useFullScreenHandle()
    const navigate = useNavigate()
    const [presentation, setPresentation] = useState<IPresentation>({})
    const [slideList, setSlideList] = useState<ISlide[]>([])
    const [slidePreview, setSlidePreview] = useState<ISlide>({})
    const [isOpenChoosePresentType, setIsOpenChoosePresentType] = useState(false)
    const [isDataChanging, setIsDataChange] = useState(false)
    const [slideTypeList, setSlideTypeList] = useState<string[]>([])
    const [groupId, setGroupId] = useState<string>('')
    const [hasMore, setHasMore] = useState(true)
    const [isOpenNewSlideList, setIsOpenNewSlideList] = useState(false)
    const { id } = useParams<{ id: string }>()
    const [presentationForm] = Form.useForm()
    const { confirm } = Modal
    const updateSlidePreview = (slide: ISlide) => {
        setIsDataChange(true)
        setSlidePreview(slide)
    }
    useEffect(() => {
        const arr: string[] = Object.keys(SlideType).map((key) => {
            return SlideType[key as keyof typeof SlideType]
        })
        setSlideTypeList(arr)
    }, [])
    const fetchPresentation = async () => {
        try {
            const result = await instance.get(`/presentation/get/${id}`)
            if (result.status === 200) {
                setPresentation(result.data)
                presentationForm.setFieldsValue(result.data)
            }
        } catch (error) {
            failureModal('Get presentation failed', error.response && error.response.data)
        }
    }
    const fetchSlideList = async (pageNumber: number) => {
        try {
            const result = await instance.get(
                `/presentation/${id}/slide/getAll?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
            )
            if (result.status === 200) {
                if (result.data < PAGE_SIZE) {
                    setHasMore(false)
                }
                if (result.data.length > 0) {
                    if (slideList.length === 0) {
                        setSlideList(result.data)
                    } else if (
                        slideList[slideList.length - 1].id !==
                        result.data[result.data.length - 1].id
                    ) {
                        setSlideList((prev) => [...prev, ...result.data])
                    }
                }
            }
        } catch (error) {
            failureModal('Get presentation failed', error.response && error.response.data)
        }
    }
    useEffect(() => {
        if (id) {
            fetchPresentation()
            fetchSlideList(1)
        }
    }, [id])
    const [showDescInput, setShowDescInput] = useState(false)
    const handleNewSlideClick = async (type: string) => {
        const result = await instance.post('/presentation/slide/add', {
            presentationId: id,
            type,
        })
        if (result.status === 200) {
            const newSlide = result.data[result.data.length - 1]
            setSlideList((prev) => [...prev, newSlide])
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
            setSlideList((prev) => {
                return prev.map((slide) => {
                    if (slide.id === slidePreview.id) {
                        return slidePreview
                    }
                    return slide
                })
            })
        }
    }, [slidePreview])
    const handleSaveSlide = async () => {
        if (slidePreview.id) {
            let data: any = {}
            switch (slidePreview.type) {
                case SlideType.MULTIPLE_CHOICE: {
                    const multipleChoiceSlide: IMultipleChoiceSlide =
                        slidePreview as IMultipleChoiceSlide
                    data = {
                        text: multipleChoiceSlide.text,
                        optionList: multipleChoiceSlide.optionList,
                    }
                    break
                }
                case SlideType.HEADING: {
                    const headingSlide = slidePreview as IHeadingSlide
                    data = {
                        heading: headingSlide.heading,
                        subHeading: headingSlide.subHeading,
                    }
                    break
                }
                case SlideType.PARAGRAPH: {
                    const paragraphSlide = slidePreview as IParagraphSlide
                    data = {
                        heading: paragraphSlide.heading,
                        paragraph: paragraphSlide.paragraph,
                    }
                    break
                }
                default:
                    break
            }
            try {
                const result = await instance.put(`/presentation/slide/edit/${slidePreview.id}`, {
                    presentationId: presentation.id,
                    type: slidePreview.type,
                    data: data ?? {},
                })
                if (result.status === 200) {
                    setSlideList(result.data)
                } else {
                    failureModal('Update slide failed', result.data.message)
                }
            } catch (error) {
                failureModal('Update slide failed', error.response && error.response.data)
            }
        }
    }
    const saveClick = async () => {
        presentationForm.submit()
        await handleSaveSlide()
        setIsDataChange(false)
    }

    const { mutate } = useMutation((startPresentingData) => {
        return instance.post('/presentation/slide/update-present-status', startPresentingData)
    })

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
                    setSlidePreview({})
                    setSlideList((prev) => prev.filter((slide) => slide.id !== slidePreview.id))
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
        const payload: any = {
            presentationId: presentation.id,
            slideId: slidePreview.id,
            isPresenting: state,
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
                            onClick={() => setIsOpenChoosePresentType(true)}
                            disabled={Object.keys(slidePreview).length === 0}
                        >
                            Present
                        </Button>
                    </div>
                </div>
                <div className={styles.navBar}>
                    <Popover
                        placement="bottomLeft"
                        content={
                            <div className={styles.slideTypeListContainer}>
                                <div className={styles.slideTypeListWrapper}>
                                    {slideTypeList.map((item: string) => {
                                        return (
                                            <div
                                                className={styles.slideTypeItem}
                                                onClick={() => handleNewSlideClick(item)}
                                            >
                                                <Card>
                                                    <p>{item}</p>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        trigger="click"
                        onOpenChange={(open: boolean) => {
                            setIsOpenNewSlideList(open)
                        }}
                    >
                        <Button
                            className={!isOpenNewSlideList ? styles.newSlideBtn : styles.cancelBtn}
                            icon={isOpenNewSlideList ? <CloseOutlined /> : <PlusOutlined />}
                            type={isOpenNewSlideList ? 'default' : 'primary'}
                        >
                            {isOpenNewSlideList ? 'Cancel' : 'New Slide'}
                        </Button>
                    </Popover>
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
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={fetchSlideList}
                        hasMore={hasMore}
                        loader={
                            <div className="loader" key={0}>
                                Loading ...
                            </div>
                        }
                        useWindow={false}
                    >
                        {slideList?.map((slide, index) => (
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
                                        visibleChat={false}
                                    />
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
                <div className={styles.slideContent}>
                    <div className={styles.slidePreview}>
                        {slidePreview?.id ? (
                            <FullScreen
                                className={styles.slidePreviewFullScreen}
                                handle={handleFullScreen}
                                onChange={handleFullScreenChange}
                            >
                                <Slide
                                    slide={slidePreview}
                                    code={presentation?.inviteCode ?? ''}
                                    isFullScreen={handleFullScreen.active}
                                    groupId={groupId}
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
                            <Select className={styles.selectType} value={slidePreview.type}>
                                {slideTypeList.map((item: string) => {
                                    return <Select.Option value={item}>{item}</Select.Option>
                                })}
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
                <ChoosePresentType
                    isOpen={isOpenChoosePresentType}
                    setIsOpen={setIsOpenChoosePresentType}
                    presentation={presentation}
                    slide={slidePreview}
                    onSuccess={async (access, presentTo): Promise<void> => {
                        if (access === Access.ONLY_GROUP) {
                            setGroupId(presentTo)
                        } else {
                            setGroupId('')
                        }
                        console.log('Full screen')
                        await handleFullScreen.enter()
                    }}
                />
            </div>
        </div>
    )
}
export default PresentationDetail
