import { ISlide } from '../slide'

export interface IPresentation {
    id?: string
    name?: string
    description?: string
    createdBy?: string
    isPresenting?: boolean
    currentSlide?: number
    inviteCode?: string
    slideList?: ISlide[]
}
