import { IParagraphSlide } from 'interfaces'

function ParagraphContent({ slide }: { slide: IParagraphSlide }) {
    console.log(slide)
    return (
        <div className="heading-content">
            <h1>Paragraph Content</h1>
        </div>
    )
}
export default ParagraphContent
