import { Suspense } from 'react'
import AuthForm from '@/components/auth/AuthForm'
import LoginButton from '@/components/auth/LoginButton'
import styles from './page.module.css'

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Tsuzuriへようこそ</h1>
                <p className={styles.subtitle}>旅の思い出を、ひとつに。</p>

                <AuthForm />

                <div className={styles.divider}>または</div>

                <Suspense fallback={<div>Loading...</div>}>
                    <LoginButton className={styles.googleBtn} />
                </Suspense>
            </div>
        </div>
    )
}
