
import { toggleComplete, deleteItem } from '@/actions/item' // Added deleteItem
import styles from '@/app/trips/[share_id]/page.module.css'
import { useState, useEffect } from 'react'
import EditItemForm from '@/components/forms/EditItemForm' // Import Edit Form

interface PlanItemProps {
    item: any
}

export default function PlanItem({ item }: PlanItemProps) {
    const [completed, setCompleted] = useState(item.is_completed)
    const [isEditing, setIsEditing] = useState(false)

    // Sync state with prop if it changes externally
    useEffect(() => {
        setCompleted(item.is_completed)
    }, [item.is_completed])

    const handleToggle = async () => {
        const newState = !completed
        setCompleted(newState)
        try {
            await toggleComplete(item.id, newState)
        } catch (e) {
            setCompleted(!newState)
            console.error(e)
        }
    }

    const handleDelete = async () => {
        if (!confirm('本当に削除しますか？')) return
        try {
            await deleteItem(item.id, 'PLAN')
        } catch (e) {
            alert('削除に失敗しました')
            console.error(e)
        }
    }

    return (
        <div className={styles.itemWrapper}>
            <div className={styles.dateMarker}>
                {new Date(item.time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className={styles.planCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
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

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            aria-label="Edit"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                            aria-label="Delete"
                        >
                            🗑️
                        </button>
                    </div>
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

            {isEditing && (
                <EditItemForm item={item} onClose={() => setIsEditing(false)} />
            )}
        </div>
    )
}
