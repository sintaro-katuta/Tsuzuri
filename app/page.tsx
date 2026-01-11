import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroVideoWrapper}>
          <video
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-placeholder.jpg"
          >
            <source src="/videos/hero-movie.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            旅の計画と記録を、<br />ひとつの綴り（タイムライン）に。
          </h1>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className={styles.painPoint}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>旅行のたびに、アプリを行き来していませんか？</h2>
          <h3 className={styles.sectionSubtitle}>
            スケジュールはチャット、写真はアルバム...<br />
            分断された思い出をひとつにまとめましょう。
          </h3>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>Tsuzuriができる、3つのこと</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📖</div>
              <h3 className={styles.featureTitle}>1. 旅の「栞」と「アルバム」を、<br />時系列でひとつに。</h3>
              <p className={styles.featureDescription}>
                予定も写真も、時間の流れに沿って並びます。<br />
                旅の軌跡が、美しいタイムラインになります。
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔗</div>
              <h3 className={styles.featureTitle}>2. 共有はURLを送るだけ。<br />アプリのインストールは不要です。</h3>
              <p className={styles.featureDescription}>
                一緒にいく友達にURLをシェアすれば、<br />
                すぐに閲覧・編集に参加できます。
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✨</div>
              <h3 className={styles.featureTitle}>3. 離れていても、<br />同じ旅を一緒に編集。</h3>
              <p className={styles.featureDescription}>
                リアルタイム同期で、相談しながら計画作り。<br />
                離れた場所にいても、同じ画面を見て盛り上がれます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Section */}
      <section className={styles.howTo}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>使い方は、とてもシンプル。</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>01</span>
              <div className={styles.stepContent}>
                <h3>旅行をつくる</h3>
                <p>タイトルと日程を決めるだけ。</p>
              </div>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>02</span>
              <div className={styles.stepContent}>
                <h3>URLをシェア</h3>
                <p>LINEなどで友だちに送信。</p>
              </div>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>03</span>
              <div className={styles.stepContent}>
                <h3>二人で自由に綴る</h3>
                <p>ログインして編集スタート！</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.ctaTitle}>さあ、新しい旅のページを綴りましょう。</h2>
          <div className={styles.loginWrapper}>
            <Link href="/login" className="btn btn-primary">
              ログインして始める
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 Tsuzuri</p>
      </footer>
    </div>
  )
}
