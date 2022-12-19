import { SlideType } from 'enums'
import { ISlide } from 'interfaces'
import HeadingContent from './heading'
import MultipleChoiceContent from './multipleChoice'
import ParagraphContent from './paragraph'

function SlideContent({ type, slide }: { type?: SlideType; slide: ISlide }) {
    switch (type) {
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
