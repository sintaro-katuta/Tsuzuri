'use client'

import { useState } from 'react'
import { updateTrip, deleteTrip } from '@/actions/trip'
import styles from './TripSettingsModal.module.css'

interface Trip {
    id: string
    title: string
    start_date: string | null
    end_date: string | null
    share_id: string
}

interface Props {
    trip: Trip
    isOpen: boolean
    onClose: () => void
}

export default function TripSettingsModal({ trip, isOpen, onClose }: Props) {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

    if (!isOpen) return null

    // Separate delete confirmation view
    if (isDeleteConfirmOpen) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <h2 className={styles.title}>旅行を削除しますか？</h2>
                    <p className={styles.warningText}>
                        この操作は取り消せません。旅行に含まれるすべてのプランと写真が削除されます。
                    </p>
                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className={`${styles.btn} ${styles.btnCancel}`}
                        >
                            キャンセル
                        </button>
                        <form action={deleteTrip}>
                            <input type="hidden" name="shareId" value={trip.share_id} />
                            <button
                                type="submit"
                                className={`${styles.btn} ${styles.btnDelete}`}
                                style={{ backgroundColor: '#dc3545', color: '#fff' }}
                            >
                                完全に削除する
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2 className={styles.title}>旅行の設定</h2>

                <form action={updateTrip}>
                    <input type="hidden" name="shareId" value={trip.share_id} />

                    <div className={styles.formGroup}>
                        <label className={styles.label}>タイトル</label>
                        <input
                            name="title"
                            type="text"
                            defaultValue={trip.title}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>開始日</label>
                        <input
                            name="startDate"
                            type="date"
                            defaultValue={trip.start_date || ''}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>終了日</label>
                        <input
                            name="endDate"
                            type="date"
                            defaultValue={trip.end_date || ''}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className={`${styles.btn} ${styles.btnDelete}`}
                        >
                            旅行を削除
                        </button>

                        <div className={styles.rightActions}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={`${styles.btn} ${styles.btnCancel}`}
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className={`${styles.btn} ${styles.btnSave}`}
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
