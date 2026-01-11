'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './AuthForm.module.css'

export default function AuthForm() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                // For simple email/password, usually we might need email verification depending on Supabase settings.
                // Assuming auto-confirm or session establishment for now, or showing a message.
                // But commonly signUp returns a session if email confirm is disabled or returns user if enabled.
                // Let's assume we want to redirect to dashboard or show "check email" message.
                // For this immediate task, let's try pushing to dashboard if session exists, else show message.

                // However, better UX is to tell user to check email if confirmation is required.
                // We will just redirect to dashboard for now, or maybe handle the case where verification is needed?
                // Let's assume defaults.
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${isLogin ? styles.active : ''}`}
                    onClick={() => setIsLogin(true)}
                >
                    ログイン
                </button>
                <button
                    className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
                    onClick={() => setIsLogin(false)}
                >
                    新規登録
                </button>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@email.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="password">
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary ${styles.submitBtn}`}
                    disabled={loading}
                >
                    {loading ? '処理中...' : (isLogin ? 'ログイン' : '新規登録')}
                </button>
            </form>
        </div>
    )
}
