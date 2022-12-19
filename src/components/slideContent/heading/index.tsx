import { ISlide } from 'interfaces'

function HeadingContent({ slide }: { slide: ISlide }) {
    console.log(slide)
    return (
        <div className="heading-content">
            <h1>Heading Content</h1>
        </div>
    )
}
export default HeadingContent
