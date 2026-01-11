'use client'

import React, { useState } from 'react'
import styles from './CalendarPicker.module.css'

interface RangeDatePickerProps {
    startDate: string // "YYYY-MM-DD" or ""
    endDate: string // "YYYY-MM-DD" or ""
    onChange: (start: string, end: string) => void
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function RangeDatePicker({ startDate, endDate, onChange }: RangeDatePickerProps) {
    // Determine initial view: use startDate, or endDate, or today
    const [viewDate, setViewDate] = useState(() => {
        if (startDate) return new Date(startDate)
        if (endDate) return new Date(endDate)
        return new Date()
    })

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

    const handleDateClick = (clickedDateStr: string) => {
        // Logic:
        // 1. If no start date, set start.
        // 2. If start is set but no end:
        //    - If clicked < start, new start = clicked, end = default (reset).
        //    - If clicked >= start, set end = clicked.
        // 3. If both set, reset to start = clicked, end = empty.

        // Actually, user requirement: "select start and end in one go".
        // Typical pattern:
        // - Click 1: Clear everything, set Start.
        // - Click 2: Set End (if > Start). If < Start, assume new Start or swap?
        // Let's go with:
        // - If (!start || (start && end)) -> Start new selection: start=clicked, end=""
        // - If (start && !end) -> 
        //      If clicked < start -> start=clicked, end="" (correction)
        //      If clicked >= start -> end=clicked (complete)

        if (!startDate || (startDate && endDate)) {
            onChange(clickedDateStr, "")
        } else if (startDate && !endDate) {
            if (clickedDateStr < startDate) {
                onChange(clickedDateStr, "")
            } else {
                onChange(startDate, clickedDateStr)
            }
        }
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

        let className = styles.dayCell
        const isToday = new Date().toDateString() === new Date(year, month, i).toDateString()

        if (isToday) className += ` ${styles.today}`

        if (startDate === dateStr) {
            className += ` ${styles.rangeStart}`
        }

        if (endDate === dateStr) {
            className += ` ${styles.rangeEnd}`
        }

        if (startDate && endDate && dateStr > startDate && dateStr < endDate) {
            className += ` ${styles.inRange}`
        }

        days.push(
            <div
                key={i}
                className={className}
                onClick={() => handleDateClick(dateStr)}
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
