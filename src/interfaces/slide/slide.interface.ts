import { SlideType } from 'enums'
import { IOption } from '../option'

export interface ISlide {
    id?: string
    text?: string
    optionList?: IOption[]
    type?: SlideType
}
