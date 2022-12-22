import { IParagraphSlide } from 'interfaces'

function ParagraphContent({ slide }: { slide: IParagraphSlide }) {
    console.log(slide)
    return (
        <div className="heading-content">
            <p>{slide.heading}</p>
            <p>{slide.paragraph}</p>
        </div>
    )
}
export default ParagraphContent
