import { SlideType } from 'enums'
import { ISlide } from 'interfaces'
import HeadingContent from './heading'
import MultipleChoiceContent from './multipleChoice'
import ParagraphContent from './paragraph'

function SlideContent({
    slide,
    presentationCode,
    groupId,
}: {
    slide: ISlide
    presentationCode: string
    groupId: string
}) {
    switch (slide.type) {
        case SlideType.MULTIPLE_CHOICE:
            return (
                <MultipleChoiceContent
                    slide={slide}
                    presentationCode={presentationCode}
                    groupId={groupId || ''}
                />
            )
        case SlideType.HEADING:
            return <HeadingContent slide={slide} />
        case SlideType.PARAGRAPH:
            return <ParagraphContent slide={slide} />
        default:
            return null
    }
}
export default SlideContent
