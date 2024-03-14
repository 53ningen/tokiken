'use client'

import { Event, EventPlace, EventType } from '@/db/events'
import Link from 'next/link'

interface Props {
  event: Event & { event_places?: EventPlace }
}

const getEventTypeLabel = (type: EventType): string => {
  switch (type) {
    case 'BROADCAST':
      return '配信'
    case 'LIVE':
      return 'ライブ'
    case 'EVENT':
      return 'イベント'
    case 'MILESTONE':
      return 'マイルストン'
    case 'OTHER':
      return 'その他'
  }
}

const CalendarCellEvent = ({ event }: Props) => {
  const now = new Date()
  const isFuture = new Date(event.date) > now
  const remains = Math.floor(
    (new Date(event.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  const typeLabel = getEventTypeLabel(event.type)
  return (
    <div className="pl-2 inline-block text-left">
      {event.start && <span className="min-w-12 pr-2 inline-block">{event.start}</span>}
      <span className="text-xs bg-black text-white font-semibold py-[2px] px-1 mr-2">
        {typeLabel}
      </span>
      <Link
        href={`/events/${event.id}`}
        prefetch={false}
        className="pr-2 text-primary font-semibold">
        {event.title}
      </Link>
      {event.event_places && (
        <span className="text-gray-500">{event.event_places.name}</span>
      )}
      {isFuture && <span className="ml-1 text-gray-500">（{remains}日後）</span>}
    </div>
  )
}

export default CalendarCellEvent
