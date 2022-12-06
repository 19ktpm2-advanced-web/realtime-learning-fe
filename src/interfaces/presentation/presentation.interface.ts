import { IMessage } from '../message'
import { ISlide } from '../slide'

export interface IPresentation {
    id?: string
    name?: string
    description?: string
    createBy?: {
        id?: string
        avatar?: string
        fullName?: string
    }
    isPresenting?: boolean
    currentSlide?: number
    inviteCode?: string
    slideList?: ISlide[]
    messages?: IMessage[]
}
