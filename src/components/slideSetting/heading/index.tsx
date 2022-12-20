import { ISlide } from 'interfaces'

function HeadingSlideSetting({ slide }: { slide: ISlide }) {
    console.log(slide)
    return (
        <div className="heading-content">
            <h1>Heading Content</h1>
        </div>
    )
}
export default HeadingSlideSetting
