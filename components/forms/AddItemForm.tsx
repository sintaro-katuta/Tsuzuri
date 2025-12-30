'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addPlan, addPhoto } from '@/actions/item'
import styles from './AddItemForm.module.css'

interface AddItemFormProps {
    tripId: string
    onClose: () => void
}

export default function AddItemForm({ tripId, onClose }: AddItemFormProps) {
    const [type, setType] = useState<'PLAN' | 'PHOTO'>('PLAN')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            formData.append('tripId', tripId)

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
                        <input
                            name="time"
                            type="datetime-local"
                            required
                            className={styles.input}
                            defaultValue={new Date().toISOString().slice(0, 16)}
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
