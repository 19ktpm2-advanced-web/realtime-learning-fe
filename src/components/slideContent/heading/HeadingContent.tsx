import { IHeadingSlide } from 'interfaces'

function HeadingContent({ slide }: { slide: IHeadingSlide }) {
    console.log(slide)
    return (
        <div className="heading-content">
            <h1>{slide.heading}</h1>
            <p>{slide.subHeading}</p>
        </div>
    )
}
export default HeadingContent
