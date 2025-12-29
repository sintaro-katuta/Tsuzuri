import { createClient } from '@/lib/supabase/server'
import { createTrip } from '@/actions/trip'
import Header from '@/components/Header'
import Link from 'next/link'
import styles from './page.module.css'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        redirect('/')
    }

    const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <>
            <Header />
            <div className={styles.container}>

                <section>
                    <h2 className={styles.sectionTitle}>My Trips</h2>
                    <div className={styles.tripList}>
                        {trips?.map((trip) => (
                            <Link
                                key={trip.id}
                                href={`/trips/${trip.share_id}`}
                                className={styles.tripCard}
                            >
                                <div className={styles.cardTitle}>{trip.title}</div>
                                <div className={styles.cardDate}>
                                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'No Date'}
                                </div>
                            </Link>
                        ))}
                        {(!trips || trips.length === 0) && (
                            <p>まだ旅行がありません。</p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className={styles.sectionTitle}>New Trip</h2>
                    <form action={createTrip} className={styles.createForm}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>タイトル</label>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="例: 京都2泊3日の旅"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>開始日</label>
                            <input
                                name="startDate"
                                type="date"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>終了日</label>
                            <input
                                name="endDate"
                                type="date"
                                className={styles.input}
                            />
                        </div>
                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                            旅行を作成する
                        </button>
                    </form>
                </section>

            </div>
        </>
    )
}
