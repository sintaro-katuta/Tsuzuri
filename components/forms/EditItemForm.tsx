'use client'

import { useState } from 'react'
import { updatePlan, updatePhoto } from '@/actions/item'
import styles from './AddItemForm.module.css' // Reusing styles
import popupStyles from '../ui/TimePickerPopup.module.css'
import TimePicker from '../ui/TimePicker'
import DatePicker from '../ui/DatePicker'


interface EditItemFormProps {
    item: any
    onClose: () => void
}

export default function EditItemForm({ item, onClose }: EditItemFormProps) {
    const [loading, setLoading] = useState(false)

    // Initialize from item.time
    const [dateValue, setDateValue] = useState(() => {
        if (item.time) {
            const date = new Date(item.time)
            const year = date.getFullYear()
            const month = ('0' + (date.getMonth() + 1)).slice(-2)
            const day = ('0' + date.getDate()).slice(-2)
            return `${year}-${month}-${day}`
        }
        return ''
    })

    const [timeValue, setTimeValue] = useState(() => {
        if (item.time) {
            const date = new Date(item.time)
            const hours = ('0' + date.getHours()).slice(-2)
            const minutes = ('0' + date.getMinutes()).slice(-2)
            return `${hours}:${minutes}`
        }
        return ''
    })

    const [showTimePicker, setShowTimePicker] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return ''
        const [y, m, d] = dateStr.split('-')
        return `${y}年${m}月${d}日`
    }



    // Type is determined by the item itself
    const type = item.type

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)

            // Combine Date and Time
            // Similar to AddItemForm, we rely on 'time' hidden input or logic
            const timeVal = formData.get('time') as string

            // If the hidden input is not present (e.g. if we don't render it), we need to handle it.
            // But we will render input type="hidden" name="time"

            // Existing logic:
            // const dateVal = formData.get('date') as string
            // const timeVal = formData.get('time') as string
            // if (dateVal && timeVal) { ... }

            // Clean up old 'date' if it exists in formData by any chance, though we removed inputs.
            formData.delete('date')

            formData.append('itemId', item.id)

            if (type === 'PLAN') {
                await updatePlan(formData)
            } else {
                await updatePhoto(formData)
            }
            onClose()
        } catch (err) {
            console.error(err)
            alert('Error updating item')
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div style={{ padding: '1.5rem 1.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {type === 'PLAN' ? '予定を編集' : '写真を編集'}
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
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Removed static TimePicker div */}
                        <input type="hidden" name="time" value={`${dateValue}T${timeValue}`} />
                    </div>

                    {type === 'PLAN' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>タイトル</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className={styles.input}
                                    defaultValue={item.title || ''}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>メモ</label>
                                <textarea
                                    name="memo"
                                    className={styles.textarea}
                                    defaultValue={item.memo || ''}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Google Map URL</label>
                                <input
                                    name="linkUrl"
                                    type="url"
                                    className={styles.input}
                                    defaultValue={item.link_url || ''}
                                />
                            </div>
                        </>
                    )}

                    {type === 'PHOTO' && (
                        <>
                            {/* Photo path is not editable in this version */}
                            <div className={styles.formGroup}>
                                <label>ひとこと</label>
                                <textarea
                                    name="memo"
                                    className={styles.textarea}
                                    defaultValue={item.memo || ''}
                                    placeholder="楽しかった！"
                                />
                            </div>
                        </>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className="btn" style={{ marginRight: '10px' }}>
                            キャンセル
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? '更新中...' : '更新'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
