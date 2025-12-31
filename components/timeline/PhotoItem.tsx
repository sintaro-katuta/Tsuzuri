
'use client'

import styles from '@/app/trips/[share_id]/page.module.css'
import { useState } from 'react'
import { deleteItem } from '@/actions/item'
import EditItemForm from '@/components/forms/EditItemForm'

interface PhotoItemProps {
    item: any
}

export default function PhotoItem({ item }: PhotoItemProps) {
    const [isEditing, setIsEditing] = useState(false)

    // Construct Public URL (Assuming public bucket)
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/trip-photos/${item.photo_path}`

    const handleDelete = async () => {
        if (!confirm('本当に削除しますか？')) return
        try {
            await deleteItem(item.id, 'PHOTO', item.photo_path)
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
            <div className={styles.photoCard}>
                <div style={{ position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={publicUrl}
                        alt={item.memo || 'Trip Photo'}
                        className={styles.photoImage}
                        loading="lazy"
                    />

                    {/* Action Buttons overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '4px',
                        padding: '2px 4px'
                    }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginRight: '5px' }}
                            aria-label="Edit"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'red' }}
                            aria-label="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                {item.memo && <div className={styles.caption}>{item.memo}</div>}
            </div>

            {isEditing && (
                <EditItemForm item={item} onClose={() => setIsEditing(false)} />
            )}
        </div>
    )
}
