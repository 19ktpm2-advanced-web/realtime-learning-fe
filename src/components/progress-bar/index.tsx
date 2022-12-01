import styles from './styles.module.css'

function ProgressBar({ loading }: { loading: boolean }) {
    return loading ? <div className={styles.progressBar} /> : null
}
export default ProgressBar
