import { Input } from 'antd'
import { IHeadingSlide } from 'interfaces'
import styles from './styles.module.css'

function HeadingSlideSetting({
    slide,
    updateSlide,
}: {
    slide: IHeadingSlide
    updateSlide: (slide: IHeadingSlide) => void
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
            <label className={styles.settingLabel}>Sub Heading</label>
            <Input.TextArea
                placeholder="Sub Heading here ..."
                value={slide?.subHeading ?? ''}
                onChange={(e) => {
                    updateSlide({
                        ...slide,
                        subHeading: e.target.value,
                    })
                }}
                className={styles.inputSubHeading}
            />
        </div>
    )
}
export default HeadingSlideSetting
