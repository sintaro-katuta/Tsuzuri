'use client'

import { toggleComplete } from '@/actions/item'
import styles from '@/app/trips/[share_id]/page.module.css' // Import styles from page module for simplicity in MVP
import { useState } from 'react'

interface PlanItemProps {
    item: any // using any for speed, ideally type from database.ts
}

export default function PlanItem({ item }: PlanItemProps) {
    const [completed, setCompleted] = useState(item.is_completed)

    const handleToggle = async () => {
        const newState = !completed
        setCompleted(newState) // Optimistic update
        try {
            await toggleComplete(item.id, newState)
        } catch (e) {
            setCompleted(!newState) // Revert
            console.error(e)
        }
    }

    return (
        <div className={styles.itemWrapper}>
            <div className={styles.dateMarker}>
                {new Date(item.time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className={styles.planCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={handleToggle}
                        style={{ transform: 'scale(1.2)' }}
                    />
                    <strong style={{
                        fontSize: '1.2rem',
                        textDecoration: completed ? 'line-through' : 'none',
                        color: completed ? '#999' : 'inherit'
                    }}>
                        {item.title}
                    </strong>
                </div>
                {item.memo && <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{item.memo}</p>}
                {item.link_url && (
                    <div style={{ marginTop: '0.5rem' }}>
                        <a
                            href={item.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0066cc', textDecoration: 'underline' }}
                        >
                            Google Map
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
