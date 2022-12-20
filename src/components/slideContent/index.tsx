import { SlideType } from 'enums'
import { ISlide } from 'interfaces'
import HeadingContent from './heading'
import MultipleChoiceContent from './multipleChoice'
import ParagraphContent from './paragraph'

function SlideContent({ slide }: { slide: ISlide }) {
    switch (slide.type) {
        case SlideType.MULTIPLE_CHOICE:
            return <MultipleChoiceContent slide={slide} />
        case SlideType.HEADING:
            return <HeadingContent slide={slide} />
        case SlideType.PARAGRAPH:
            return <ParagraphContent slide={slide} />
        default:
            return null
    }
}
export default SlideContent
