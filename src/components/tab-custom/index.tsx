import { Button } from 'antd'
import { useState } from 'react'
import styles from './styles.module.css'

function TabCustom({ tabs, defaultIndex = 0 }: { tabs: { key: string; content: string; component: JSX.Element }[]; defaultIndex: number }) {
    const [active, setActive] = useState(tabs[defaultIndex].key)
    const [component, setComponent] = useState<JSX.Element>(tabs[defaultIndex].component)
    return (
        <div>
            <div className={styles.navWrapper}>
                {tabs.map((tab) => (
                    <Button
                        key={tab.key}
                        className={`${styles.navBtn} ${active === tab.key ? styles.active : null}`}
                        onClick={() => {
                            setActive(tab.key)
                            setComponent(tab.component)
                        }}
                    >
                        {tab.content}
                    </Button>
                ))}
            </div>
            {component}
        </div>
    )
}
export default TabCustom
