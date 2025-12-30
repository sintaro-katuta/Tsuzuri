'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from '@/app/trips/[share_id]/page.module.css'
import PlanItem from './PlanItem'
import PhotoItem from './PhotoItem'
import AddItemForm from '@/components/forms/AddItemForm'

interface TimelineProps {
    tripId: string
    initialItems: any[]
}

export default function Timeline({ tripId, initialItems }: TimelineProps) {
    const [items, setItems] = useState<any[]>(initialItems)
    const [showAddForm, setShowAddForm] = useState(false)
    const supabase = createClient()
    const router = useRouter() // Used for refreshing if needed, but we try to rely on state

    useEffect(() => {
        // Subscribe to realtime changes
        const channel = supabase
            .channel('timeline-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'timeline_items',
                    filter: `trip_id=eq.${tripId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setItems((prev) => [...prev, payload.new].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
                    } else if (payload.eventType === 'DELETE') {
                        setItems((prev) => prev.filter((item) => item.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setItems((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, tripId])

    return (
        <div className={styles.timelineContent}>
            {items.map((item) => (
                item.type === 'PLAN' ? (
                    <PlanItem key={item.id} item={item} />
                ) : (
                    <PhotoItem key={item.id} item={item} />
                )
            ))}

            {items.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
                    右下のボタンから予定や写真を追加しよう！
                </p>
            )}

            <button className={styles.addButton} onClick={() => setShowAddForm(true)}>
                +
            </button>

            {showAddForm && (
                <AddItemForm tripId={tripId} onClose={() => setShowAddForm(false)} />
            )}
        </div>
    )
}
