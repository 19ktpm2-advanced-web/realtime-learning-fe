import { SlideType } from 'enums'
import { IHeadingSlide, IMultipleChoiceSlide, IParagraphSlide, ISlide } from 'interfaces'
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
        case SlideType.MULTIPLE_CHOICE: {
            const multipleChoiceSlide = slide as IMultipleChoiceSlide
            return <MultipleChoiceSetting slide={multipleChoiceSlide} updateSlide={updateSlide} />
        }
        case SlideType.HEADING: {
            const headingSlide = slide as IHeadingSlide
            return <HeadingSlideSetting slide={headingSlide} />
        }
        case SlideType.PARAGRAPH: {
            const paragraphSlide = slide as IParagraphSlide
            return <ParagraphSlideSetting slide={paragraphSlide} />
        }
        default:
            return null
    }
}
export default SlideSetting
