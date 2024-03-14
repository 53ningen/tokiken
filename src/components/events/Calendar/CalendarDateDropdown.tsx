'use client'

import { CalendarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  date: Date
}

const CalendarDateDropdown = ({ date }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const currentMonthYYYY = date.getFullYear()
  const currentMonthMM = (date.getMonth() + 1).toString().padStart(2, '0')
  const now = new Date()

  // 2015/04 〜 current month
  const dates = Array.from(
    { length: (now.getFullYear() - 2015) * 12 + now.getMonth() + 1 },
    (_, i) => {
      const y = Math.floor(i / 12) + 2015
      const m = (i % 12) + 1
      return new Date(y, m - 1, 1)
    }
  )
    .filter((d) => !(d.getFullYear() === 2015 && d.getMonth() < 3))
    .reverse()
  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex gap-2 text-gray-500 font-bold items-center">
        <CalendarIcon className="h-5 w-5" />
        {currentMonthYYYY}/{currentMonthMM}
      </button>
      {isHovered && (
        <div className="absolute grid w-32 max-h-48 overflow-y-scroll pt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-50 text-center">
          {dates.map((date) => {
            const yyyy = date.getFullYear()
            const mm = (date.getMonth() + 1).toString().padStart(2, '0')
            return (
              <Link
                key={`${yyyy}/${mm}`}
                href={`/calendar/${yyyy}${mm}`}
                prefetch={false}
                className="p-2">
                {yyyy}/{mm}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CalendarDateDropdown
