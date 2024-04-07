import { Event, getEventPlace } from '@/db/events'
import Link from 'next/link'
import EventCastList from './EventCastList'
import EventCreditList from './EventCreditList'

interface Props {
  event: Event
}

const EventInfo = async ({ event }: Props) => {
  const place = await getEventPlace(event.id)()
  return (
    <div className="grid gap-1">
      <div className="text-xs text-gray-500">
        <span className="pr-1">日時:</span>
        <span>
          {event.date} {event.start}
        </span>
      </div>
      {place && (
        <div className="text-xs text-gray-500">
          <span className="pr-1">会場:</span>
          <Link
            href={`http://local.google.co.jp/maps?q=${place.address}`}
            target="_blank">
            {place.name}（{place.address}）
          </Link>
        </div>
      )}
      {event.hashtags && (
        <div className="flex gap-1 text-xs text-gray-500">
          <span>ハッシュタグ:</span>
          {event.hashtags.split(',').map((hashtag) => (
            <Link
              key={hashtag}
              href={`https://twitter.com/hashtag/${encodeURIComponent(hashtag)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary">{`#${hashtag}`}</Link>
          ))}
        </div>
      )}
      <div className="[&_div]:inline-block text-xs items-center text-gray-500">
        <EventCastList event={event} />
      </div>
      <EventCreditList event={event} />
    </div>
  )
}

export default EventInfo
