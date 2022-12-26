import { IHeadingSlide } from 'interfaces'
import styles from './styles.module.css'

function HeadingContent({ slide }: { slide: IHeadingSlide }) {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.heading}>{slide.heading}</h1>
            <p className={styles.subHeading}>{slide.subHeading}</p>
        </div>
    )
}
export default HeadingContent
