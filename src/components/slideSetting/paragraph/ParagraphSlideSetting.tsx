import { IParagraphSlide } from 'interfaces'
import { Input } from 'antd'
import styles from './styles.module.css'

function ParagraphSlideSetting({
    slide,
    updateSlide,
}: {
    slide: IParagraphSlide
    updateSlide: (slide: IParagraphSlide) => void
}) {
    console.log(slide)
    return (
        <div className={styles.settingContentWrapper}>
            <label className={styles.settingLabel}>Heading</label>
            <Input
                placeholder="Heading here ..."
                value={slide?.heading ?? ''}
                onChange={(e) => {
                    updateSlide({
                        ...slide,
                        heading: e.target.value,
                    })
                }}
                className={styles.inputHeading}
            />
            <label className={styles.settingLabel}>Paragraph</label>
            <Input.TextArea
                placeholder="Enter paragraph here ..."
                value={slide?.paragraph ?? ''}
                onChange={(e) => {
                    updateSlide({
                        ...slide,
                        paragraph: e.target.value,
                    })
                }}
                className={styles.inputParagraph}
            />
        </div>
    )
}
export default ParagraphSlideSetting
