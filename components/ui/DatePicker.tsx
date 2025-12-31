'use client'

import React, { useState, useEffect } from 'react'
import styles from './CalendarPicker.module.css'

interface DatePickerProps {
    value: string // "YYYY-MM-DD"
    onChange: (value: string) => void
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function DatePicker({ value, onChange }: DatePickerProps) {
    // Current viewed month
    const [viewDate, setViewDate] = useState(() => {
        return value ? new Date(value) : new Date()
    })

    // Selected date (from props)
    const [selectedDateStr, setSelectedDateStr] = useState(value)

    useEffect(() => {
        if (value) {
            setSelectedDateStr(value)
            // Optional: update view if prop changes drastically? 
            // Better to keep user's view unless initial load.
        }
    }, [value])

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
    }

    const handleDateClick = (day: number) => {
        const year = viewDate.getFullYear()
        const month = viewDate.getMonth() + 1
        // Format to YYYY-MM-DD
        const yStr = year.toString()
        const mStr = month.toString().padStart(2, '0')
        const dStr = day.toString().padStart(2, '0')
        const newValue = `${yStr}-${mStr}-${dStr}`

        onChange(newValue)
    }

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth() // 0-indexed
    const numDays = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className={`${styles.dayCell} ${styles.empty}`} />)
    }
    // Days of current month
    for (let i = 1; i <= numDays; i++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
        const isSelected = selectedDateStr === dateStr
        const isToday = new Date().toDateString() === new Date(year, month, i).toDateString()

        days.push(
            <div
                key={i}
                className={`${styles.dayCell} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                onClick={() => handleDateClick(i)}
            >
                {i}
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button type="button" onClick={handlePrevMonth} className={styles.navButton}>
                    &lt;
                </button>
                <div className={styles.monthLabel}>
                    {year}年 {month + 1}月
                </div>
                <button type="button" onClick={handleNextMonth} className={styles.navButton}>
                    &gt;
                </button>
            </div>

            <div className={styles.grid}>
                {WEEKDAYS.map((w) => (
                    <div key={w} className={styles.weekday}>
                        {w}
                    </div>
                ))}
                {days}
            </div>
        </div>
    )
}
