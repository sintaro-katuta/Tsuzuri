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
            scrollToValue(hourRef.current, parseInt(h), false)
            scrollToValue(minuteRef.current, parseInt(m), false)
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

            // Debounce or just update parent
            // To allow parent to update state and pass back prop, we need to be careful of loops
            // Here we just notify parent of change.
            if (type === 'hour') {
                onChange(`${val}:${selectedMinute}`)
            } else {
                onChange(`${selectedHour}:${val}`)
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.highlight}></div>

            {/* Hours */}
            <div
                className={styles.column}
                ref={hourRef}
                onScroll={(e) => handleScroll(e, HOURS, setSelectedHour, 'hour')}
            >
                <div className={styles.spacer}></div>
                {HOURS.map((h) => (
                    <div
                        key={h}
                        className={`${styles.item} ${h === selectedHour ? styles.selected : ''}`}
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
            >
                <div className={styles.spacer}></div>
                {MINUTES.map((m) => (
                    <div
                        key={m}
                        className={`${styles.item} ${m === selectedMinute ? styles.selected : ''}`}
                    >
                        {m}
                    </div>
                ))}
                <div className={styles.spacer}></div>
            </div>
        </div>
    )
}
