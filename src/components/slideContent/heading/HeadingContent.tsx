import { IHeadingSlide } from 'interfaces'

function HeadingContent({ slide }: { slide: IHeadingSlide }) {
    console.log(slide)
    return (
        <div className="heading-content">
            <h1>Heading Content</h1>
        </div>
    )
}
export default HeadingContent
