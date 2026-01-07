'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addPlan, addPhoto } from '@/actions/item'
import styles from './AddItemForm.module.css'
import popupStyles from '../ui/TimePickerPopup.module.css'
import TimePicker from '../ui/TimePicker'
import DatePicker from '../ui/DatePicker'


interface AddItemFormProps {
    tripId: string
    onClose: () => void
}

export default function AddItemForm({ tripId, onClose }: AddItemFormProps) {
    const [type, setType] = useState<'PLAN' | 'PHOTO'>('PLAN')


    const [loading, setLoading] = useState(false)

    // Initialize with current date and time
    const [dateValue, setDateValue] = useState(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = ('0' + (now.getMonth() + 1)).slice(-2)
        const day = ('0' + now.getDate()).slice(-2)
        return `${year}-${month}-${day}`
    })

    const [timeValue, setTimeValue] = useState(() => {
        const now = new Date()
        const hours = ('0' + now.getHours()).slice(-2)
        const minutes = ('0' + now.getMinutes()).slice(-2)
        return `${hours}:${minutes}`
    })

    const [showTimePicker, setShowTimePicker] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)

    // Helper to display date in Japanese format
    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return ''
        const [y, m, d] = dateStr.split('-')
        return `${y}年${m}月${d}日`
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)

            // Combine Date and Time into ISO string
            // Date and Time are already combined in the hidden input 'time'
            // We just need to make sure the server action handles the ISO string correctly
            // The previous logic combined checks for date and time fields, now we have one 'time' field.

            // If the hidden input is used, it sends 'time' directly.
            // Check if we need to do anything else.
            // Existing logic:
            // const dateVal = formData.get('date') as string
            // const timeVal = formData.get('time') as string
            // if (dateVal && timeVal) { ... }

            // New logic: 'time' is already set by hidden input (or just reliance on what's in formData)
            // But we deleted 'date' input.
            // The hidden input has name="time", so formData.get('time') returns the ISO string.
            // We should just ensure it exists.

            const timeVal = formData.get('time') as string
            if (!timeVal) {
                throw new Error('Date is required')
            }

            formData.append('tripId', tripId)
            // ... (rest of logic)

            if (type === 'PLAN') {
                await addPlan(formData)
                onClose()
            } else {
                // Photo Upload flow
                const fileInput = (e.currentTarget.elements.namedItem('photo') as HTMLInputElement)
                const file = fileInput.files?.[0]

                if (!file) throw new Error('File required')

                const supabase = createClient()
                const ext = file.name.split('.').pop()
                const path = `${tripId}/${Date.now()}.${ext}`

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('trip-photos')
                    .upload(path, file)

                if (uploadError) throw uploadError

                // 2. Add to DB
                formData.append('photoPath', path)
                formData.delete('photo') // Don't send the file content to Server Action
                await addPhoto(formData)
                onClose()
            }
        } catch (err) {
            console.error(err)
            alert('Error adding item')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${type === 'PLAN' ? styles.active : ''}`}
                        onClick={() => setType('PLAN')}
                    >
                        予定
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${type === 'PHOTO' ? styles.active : ''}`}
                        onClick={() => setType('PHOTO')}
                    >
                        写真
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>日時</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className={popupStyles.timeInputContainer}>
                                <input
                                    type="text"
                                    readOnly
                                    value={formatDateDisplay(dateValue)}
                                    onClick={() => setShowDatePicker(true)}
                                    className={styles.input}
                                    style={{ cursor: 'pointer', textAlign: 'center' }}
                                />
                                {showDatePicker && (
                                    <>
                                        <div className={popupStyles.backdrop} onClick={() => setShowDatePicker(false)} />
                                        <div className={popupStyles.timePickerPopup}>
                                            <DatePicker
                                                value={dateValue}
                                                onChange={setDateValue}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={popupStyles.timeInputContainer}>
                                <input
                                    type="text"
                                    readOnly
                                    value={timeValue}
                                    onClick={() => setShowTimePicker(true)}
                                    className={styles.input}
                                    style={{ cursor: 'pointer', textAlign: 'center' }}
                                />
                                {showTimePicker && (
                                    <>
                                        <div className={popupStyles.backdrop} onClick={() => setShowTimePicker(false)} />
                                        <div className={popupStyles.timePickerPopup}>
                                            <TimePicker
                                                value={timeValue}
                                                onChange={setTimeValue}
                                            />
                                            {/* Optional: Add a close button inside if needed, but backdrop works */}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <input
                            type="hidden"
                            name="time"
                            value={
                                dateValue && timeValue
                                    ? new Date(`${dateValue}T${timeValue}`).toISOString()
                                    : ''
                            }
                        />
                    </div>

                    {type === 'PLAN' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>タイトル</label>
                                <input name="title" type="text" required className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>メモ</label>
                                <textarea name="memo" className={styles.textarea} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Google Map URL</label>
                                <input name="linkUrl" type="url" className={styles.input} />
                            </div>
                        </>
                    )}

                    {type === 'PHOTO' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>写真を選択</label>
                                <input name="photo" type="file" required accept="image/*" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>ひとこと</label>
                                <textarea name="memo" className={styles.textarea} placeholder="楽しかった！" />
                            </div>
                        </>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className="btn" style={{ marginRight: '10px' }}>
                            キャンセル
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? '送信中...' : '追加'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
