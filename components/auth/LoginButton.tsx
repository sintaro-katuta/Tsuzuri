'use client'

import { createClient } from '@/lib/supabase/client'

import { useSearchParams } from 'next/navigation'

export default function LoginButton({ className }: { className?: string }) {
    const searchParams = useSearchParams()
    const next = searchParams.get('next')

    const handleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback${next ? `?next=${next}` : ''}`,
            },
        })
    }

    return (
        <button className={`btn btn-primary ${className || ''}`} onClick={handleLogin}>
            Googleでログイン
        </button>
    )
}
