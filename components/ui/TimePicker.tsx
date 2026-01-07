'use client'

import React, { useRef, useEffect, useState } from 'react'
import styles from './IOSPicker.module.css'

interface TimePickerProps {
    value: string // "HH:mm"
    onChange: (value: string) => void
}

const ITEM_HEIGHT = 48 // 3rem = 48px usually, make sure this matches CSS

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

export default function TimePicker({ value, onChange }: TimePickerProps) {
    const [selectedHour, setSelectedHour] = useState('00')
    const [selectedMinute, setSelectedMinute] = useState('00')

    const hourRef = useRef<HTMLDivElement>(null)
    const minuteRef = useRef<HTMLDivElement>(null)

    // Internal state to block loop triggering
    const isScrolling = useRef(false)

    // Sync props to state
    useEffect(() => {
        if (!value) return
        const [h, m] = value.split(':')
        if (h && m) {
            setSelectedHour(h)
            setSelectedMinute(m)

            // Refined Logic:
            // Only scroll programmatically if the "logical" item index is different.
            // If we are on the correct item (index matches), we trust CSS Scroll Snap to handle the final pixel alignment.
            // This prevents the JS from fighting the user's "slow" scroll or momentum.
            const hIdx = parseInt(h)
            const mIdx = parseInt(m)

            if (hourRef.current) {
                const currentScroll = hourRef.current.scrollTop
                const currentIndex = Math.round(currentScroll / ITEM_HEIGHT)
                if (currentIndex !== hIdx) {
                    scrollToValue(hourRef.current, hIdx, false)
                }
            }
            if (minuteRef.current) {
                const currentScroll = minuteRef.current.scrollTop
                const currentIndex = Math.round(currentScroll / ITEM_HEIGHT)
                if (currentIndex !== mIdx) {
                    scrollToValue(minuteRef.current, mIdx, false)
                }
            }
        }
    }, [value])

    const scrollToValue = (element: HTMLDivElement | null, index: number, smooth = true) => {
        if (!element) return
        // Ideally we should wait for layout but let's try direct
        element.scrollTo({
            top: index * ITEM_HEIGHT,
            behavior: smooth ? 'smooth' : 'auto'
        })
    }

    const handleScroll = (
        e: React.UIEvent<HTMLDivElement>,
        items: string[],
        setter: React.Dispatch<React.SetStateAction<string>>,
        type: 'hour' | 'minute'
    ) => {
        const target = e.currentTarget
        const index = Math.round(target.scrollTop / ITEM_HEIGHT)
        const val = items[index]
        if (val) {
            setter(val)
            if (type === 'hour') {
                onChange(`${val}:${selectedMinute}`)
            } else {
                onChange(`${selectedHour}:${val}`)
            }
        }
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLDivElement>,
        type: 'hour' | 'minute',
        items: string[]
    ) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            const currentVal = type === 'hour' ? selectedHour : selectedMinute
            const currentIndex = items.indexOf(currentVal)
            let newIndex = currentIndex

            if (e.key === 'ArrowUp') {
                newIndex = Math.max(0, currentIndex - 1)
            } else if (e.key === 'ArrowDown') {
                newIndex = Math.min(items.length - 1, currentIndex + 1)
            }

            if (newIndex !== currentIndex) {
                const newVal = items[newIndex]
                const ref = type === 'hour' ? hourRef.current : minuteRef.current
                scrollToValue(ref, newIndex, true)
            }
        }
    }

    // Auto-focus the hour column when mounted to enable keyboard usage immediately
    useEffect(() => {
        if (hourRef.current) {
            hourRef.current.focus()
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.highlight}></div>

            {/* Hours */}
            <div
                className={styles.column}
                ref={hourRef}
                onScroll={(e) => handleScroll(e, HOURS, setSelectedHour, 'hour')}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 'hour', HOURS)}
                role="listbox"
                aria-label="Hour"
            >
                <div className={styles.spacer}></div>
                {HOURS.map((h, i) => (
                    <div
                        key={h}
                        className={`${styles.item} ${h === selectedHour ? styles.selected : ''}`}
                        role="option"
                        aria-selected={h === selectedHour}
                        onClick={() => scrollToValue(hourRef.current, i, true)}
                    >
                        {h}
                    </div>
                ))}
                <div className={styles.spacer}></div>
            </div>

            <div className={styles.separator}>:</div>

            {/* Minutes */}
            <div
                className={styles.column}
                ref={minuteRef}
                onScroll={(e) => handleScroll(e, MINUTES, setSelectedMinute, 'minute')}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 'minute', MINUTES)}
                role="listbox"
                aria-label="Minute"
            >
                <div className={styles.spacer}></div>
                {MINUTES.map((m, i) => (
                    <div
                        key={m}
                        className={`${styles.item} ${m === selectedMinute ? styles.selected : ''}`}
                        role="option"
                        aria-selected={m === selectedMinute}
                        onClick={() => scrollToValue(minuteRef.current, i, true)}
                    >
                        {m}
                    </div>
                ))}
                <div className={styles.spacer}></div>
            </div>
        </div>
    )
}
