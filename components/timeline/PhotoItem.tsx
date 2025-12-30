'use client'

import styles from '@/app/trips/[share_id]/page.module.css'
import Image from 'next/image'

interface PhotoItemProps {
    item: any
}

export default function PhotoItem({ item }: PhotoItemProps) {
    // Construct Public URL (Assuming public bucket)
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/trip-photos/${item.photo_path}`

    return (
        <div className={styles.itemWrapper}>
            <div className={styles.dateMarker}>
                {new Date(item.time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className={styles.photoCard}>
                {/* Using standard img tag for simplicity with unknown dimensions or external URLs initially, 
            but Next/Image is better if we set width/height. 
            For now, just use img with simple styling to ensure it fits. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={publicUrl}
                    alt={item.memo || 'Trip Photo'}
                    className={styles.photoImage}
                    loading="lazy"
                />
                {item.memo && <div className={styles.caption}>{item.memo}</div>}
            </div>
        </div>
    )
}
