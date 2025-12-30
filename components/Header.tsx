import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/dashboard" className={styles.logo}>
                    Tabiori Scrap
                </Link>
                <nav className={styles.nav}>
                    {/* Future: User Avatar / Logout */}
                </nav>
            </div>
        </header>
    )
}
