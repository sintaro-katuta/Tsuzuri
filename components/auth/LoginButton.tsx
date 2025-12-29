'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginButton() {
    const handleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <button className="btn btn-primary" onClick={handleLogin}>
            Googleでログイン
        </button>
    )
}
