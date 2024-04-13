'use client'

import { AnnualEvent } from '@/db/annual-events'
import { Blog } from '@/db/blogs'
import { Event } from '@/db/events'
import { numToMMDD, numToYYYYMMDD } from '@/utils/datetime'
import { CalendarLocalStorageKeys, LocalStorage } from '@/utils/local-storage'
import Link from 'next/link'
import { useState } from 'react'
import CalendarCell from './CalendarCell'
import CalendarNavigation from './CalendarNavigation'

interface Props {
  year: number
  month: number
  events: Event[]
  annualEvents: AnnualEvent[]
  blogs: Blog[]
}

const CalendarBody = ({ year, month, events, annualEvents, blogs }: Props) => {
  const showBlogTitlesInit = (() => {
    const value = LocalStorage.getItem(CalendarLocalStorageKeys.showBlogTitles)
    return value ? value === '1' : true
  })()
  const [showBlogTitles, setShowBlogTitles] = useState<boolean>(showBlogTitlesInit)
  const daysOfTheMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysOfTheMonth }, (_, i) => i + 1)
  return (
    <div className="mb-64">
      <CalendarNavigation date={new Date(year, month - 1, 1)} />
      <div className="pb-4 text-right">
        <Link
          href={`/articles/${year}${month.toString().padStart(2, '0')}`}
          className="text-primary text-sm">
          📝 {year}年{month}月の記事一覧ページ
        </Link>
      </div>
      <div className="flex items-center gap-2 pb-4 mb-2 text-left text-gray-500 text-sm">
        <>
          <input
            id="show-blog-titles"
            type="checkbox"
            checked={showBlogTitles}
            onChange={(e) => {
              setShowBlogTitles(e.currentTarget.checked)
              LocalStorage.setItem(
                CalendarLocalStorageKeys.showBlogTitles,
                e.currentTarget.checked ? '1' : '0'
              )
            }}
          />
          <label htmlFor="show-blog-titles" className="select-none cursor-pointer">
            ブログタイトルを表示
          </label>
        </>
      </div>
      <div className="grid gap-4">
        {days.map((day) => {
          const mmdd = numToMMDD(month, day)
          const yyyymmdd = numToYYYYMMDD(year, month, day)
          return (
            <CalendarCell
              key={day}
              date={new Date(year, month - 1, day)}
              events={events.filter((e) => e.date === yyyymmdd)}
              annualEvents={annualEvents.filter((e) => e.date === mmdd)}
              blogs={blogs.filter((b) => b.published_at.startsWith(yyyymmdd))}
              showBlogTitles={showBlogTitles}
            />
          )
        })}
      </div>
      <CalendarNavigation date={new Date(year, month - 1, 1)} />
    </div>
  )
}

export default CalendarBody
