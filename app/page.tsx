import LoginButton from '@/components/auth/LoginButton'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Tabiori Scrap</h1>
        <p className={styles.description}>
          旅の思い出を、一枚のタイムラインに。
        </p>
        <div className={styles.login}>
          <LoginButton />
        </div>
      </main>
    </div>
  )
}
