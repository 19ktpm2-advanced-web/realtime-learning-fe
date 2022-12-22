import { IParagraphSlide } from 'interfaces'
import styles from './styles.module.css'

function ParagraphContent({ slide }: { slide: IParagraphSlide }) {
    console.log(slide)
    return (
        <div className={styles.paragraphWrapper}>
            <p className={styles.paragraphHeading}>{slide.heading}</p>
            <p className={styles.paragraphContent}>{slide.paragraph}</p>
        </div>
    )
}
export default ParagraphContent
