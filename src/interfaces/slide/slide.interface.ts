import { SlideType } from 'enums'
import { IOption } from '../option'

export interface ISlide {
    id?: string
    type?: SlideType
}
export interface IMultipleChoiceSlide extends ISlide {
    text?: string
    optionList?: IOption[]
}

export interface IHeadingSlide extends ISlide {
    heading?: string
    subHeading?: string
}

export interface IParagraphSlide extends ISlide {
    heading?: string
    paragraph?: string
}
