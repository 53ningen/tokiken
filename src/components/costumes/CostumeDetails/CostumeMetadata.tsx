import { inquiryFormUrl } from '@/consts/metadata'
import { Artist } from '@/db/artists'
import { Costume, CostumeType } from '@/db/costumes'
import { Event } from '@/db/events'
import Link from 'next/link'

interface Props {
  costume: Costume & { events: Event | null } & { artists: Artist | null }
}

const CostumeMetadata = ({ costume }: Props) => {
  const { name, type, is_official_name, events: event } = costume
  const typeLabel = getCostumeTypeLabel(type)
  return (
    <div className="text-left grid gap-1 [&_]:text-xs [&_]:text-gray-500">
      <div>
        <span className="pr-1">衣装呼称タイプ:</span>
        <span> {is_official_name ? '公式' : '非公式'}</span>
      </div>
      <h2 className="font-bold text-lg text-primary">{name}</h2>
      <div>
        <span className="pr-1">衣装デザイナー:</span>
        {costume.artists ? (
          <Link href={`/artists/${costume.artist_id}`} className="text-primary">
            {costume.artists.name}
          </Link>
        ) : (
          <>
            <span className="pr-1">調査中</span>
            <span>
              [
              <Link href={inquiryFormUrl} target="_blank" className="text-primary">
                情報を提供する
              </Link>
              ]
            </span>
          </>
        )}
      </div>
      {event && (
        <>
          <div>
            <span className="pr-1">お披露目日:</span>
            <Link
              href={`/calendar/${event.date.replaceAll('-', '').slice(0, 6)}`}
              className="text-primary">
              {event.date}
            </Link>
          </div>
          <div>
            <span className="pr-1">お披露目イベント:</span>
            <Link href={`/events/${event.id}`} className="text-primary">
              {event.title}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default CostumeMetadata

const getCostumeTypeLabel = (type: CostumeType) => {
  switch (type) {
    case 'chotokisen':
      return '超ときめき♡宣伝部'
    case 'tokisen':
      return 'ときめき♡宣伝部'
    case 'birthday':
      return '生誕衣装'
  }
}
