import { SlideType } from 'enums'
import { ISlide } from 'interfaces'
import HeadingSlideSetting from './heading'
import MultipleChoiceSetting from './multipleChoice'
import ParagraphSlideSetting from './paragraph'

function SlideSetting({
    slide,
    updateSlide,
}: {
    slide: ISlide
    updateSlide: (slide: ISlide) => void
}) {
    switch (slide.type) {
        case SlideType.MULTIPLE_CHOICE:
            return <MultipleChoiceSetting slide={slide} updateSlide={updateSlide} />
        case SlideType.HEADING:
            return <HeadingSlideSetting slide={slide} />
        case SlideType.PARAGRAPH:
            return <ParagraphSlideSetting slide={slide} />
        default:
            return null
    }
}
export default SlideSetting
