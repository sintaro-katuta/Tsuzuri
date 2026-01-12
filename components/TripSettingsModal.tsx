'use client'

import { useState } from 'react'
import { updateTrip, deleteTrip } from '@/actions/trip'
import styles from './TripSettingsModal.module.css'
import PopupRangeDatePicker from './ui/PopupRangeDatePicker'

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
                <div className={styles.header}>
                    <h2 className={styles.title}>旅行の設定</h2>
                    <button
                        type="button"
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        className={styles.trashIconBtn}
                        aria-label="Delete Trip"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>

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
                        <label className={styles.label}>日程</label>
                        <PopupRangeDatePicker
                            startName="startDate"
                            endName="endDate"
                            defaultStartDate={trip.start_date || ''}
                            defaultEndDate={trip.end_date || ''}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.actions}>
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


                </form>
            </div>
        </div>
    )
}
