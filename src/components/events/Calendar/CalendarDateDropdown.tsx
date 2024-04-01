'use client'

import { CalendarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  date: Date
}

const CalendarDateDropdown = ({ date }: Props) => {
  const now = new Date()
  const years = Array.from(
    { length: now.getFullYear() - 2015 + 1 },
    (_, i) => now.getFullYear() - i
  )
  const months = Array.from({ length: 12 }, (_, i) => 12 - i)

  const [year, setYear] = useState(date.getFullYear().toString())
  const [month, setMonth] = useState((date.getMonth() + 1).toString())
  const changed = () => {
    return (
      year !== date.getFullYear().toString() || month !== (date.getMonth() + 1).toString()
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 justify-center items-center text-gray-500">
        <select name="year" value={year} onChange={(e) => setYear(e.currentTarget.value)}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span>/</span>
        <select
          name="month"
          value={month}
          onChange={(e) => setMonth(e.currentTarget.value)}>
          {months
            .filter((m) => (year === '2015' ? m >= 4 : true))
            .map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, '0')}
              </option>
            ))}
        </select>
      </div>
      {changed() && (
        <div>
          <Link
            href={`/calendar/${year}${month.toString().padStart(2, '0')}`}
            className="flex gap-2 text-primary border rounded px-3 py-1">
            <CalendarIcon className="h-5 w-5" />
            {year}/{month.toString().padStart(2, '0')} のカレンダーを開く
          </Link>
        </div>
      )}
    </div>
  )
}

export default CalendarDateDropdown
