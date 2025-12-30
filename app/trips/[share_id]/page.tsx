import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Timeline from '@/components/timeline/Timeline'
import Header from '@/components/Header'
import styles from './page.module.css'

interface Props {
    params: Promise<{ share_id: string }>
}

export default async function TripPage({ params }: Props) {
    const { share_id } = await params
    const supabase = await createClient()

    // 1. Get Trip by share_id (Auth check handled by RLS, but here we just need to know if it exists)
    // Since we allow access to anyone with the link (authenticated), we fetch it.
    const { data: trip } = await supabase
        .from('trips')
        .select('*')
        .eq('share_id', share_id)
        .single()

    if (!trip) {
        notFound()
    }

    // 2. Get Items
    const { data: items } = await supabase
        .from('timeline_items')
        .select('*')
        .eq('trip_id', trip.id)
        .order('time', { ascending: true })

    // 3. Check Auth (for determining if user can edit? Current logic: All auth users can edit)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // If not logged in, redirect to login (or handle as read-only if we supported that)
        redirect(`/?next=/trips/${share_id}`)
    }

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <header className={styles.timelineHeader}>
                    <h1 className={styles.tripTitle}>{trip.title}</h1>
                </header>

                <Timeline
                    tripId={trip.id}
                    initialItems={items || []}
                />
            </div>
        </>
    )
}
