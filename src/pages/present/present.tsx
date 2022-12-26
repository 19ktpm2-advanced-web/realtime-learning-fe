import { useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import Slide from 'components/slide'
import privateInstance from 'service/axiosPrivate'
import publicInstance from 'service/axiosPublic'
import LoadingSpin from '../../components/loading-spin'
import { IMultipleChoiceSlide } from '../../interfaces'

function Present() {
    const navigate = useNavigate()
    const {
        presentationCode,
        groupId,
    }: {
        presentationCode: string
        groupId?: string
    } = useLoaderData() as any
    const [slide, setSlide] = useState<IMultipleChoiceSlide>({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (presentationCode) {
            setIsLoading(true)
            if (!groupId) {
                publicInstance
                    .get(`/presentation/slide/get/${presentationCode}`)
                    .then((res) => {
                        setIsLoading(false)
                        if (res?.status === 200) {
                            setSlide(res.data)
                        } else {
                            navigate('/404')
                        }
                    })
                    .catch(() => {
                        navigate('/404')
                    })
            } else {
                console.log('Private', groupId)
                privateInstance
                    .get(`/presentation/slide/get/${presentationCode}/${groupId}`)
                    .then((res) => {
                        setIsLoading(false)
                        console.log('res', res)
                        if (res?.status === 200) {
                            setSlide(res.data)
                        } else {
                            navigate('/404')
                        }
                    })
                    .catch((error) => {
                        console.log('error', error)
                        navigate('/404')
                    })
            }
        }
    }, [presentationCode, groupId])

    return isLoading ? (
        <LoadingSpin />
    ) : (
        <Slide
            slide={slide}
            code={presentationCode}
            isFullScreen
            groupId={groupId}
            handleEndPresent={() => {
                navigate('/404')
            }}
        />
    )
}

export default Present
