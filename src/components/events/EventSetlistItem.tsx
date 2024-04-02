import { EventSetlist } from '@/db/events'
import { Song } from '@/db/songs'
import Link from 'next/link'

interface Props {
  item: EventSetlist & { songs: Song | null }
}

const EventSetlistItem = ({ item }: Props) => {
  const song = item.songs
  return (
    <div className="flex gap-2">
      <div className="select-none">{item.order_label || item.order.toString()}.</div>
      <div className="font-medium">
        {song ? (
          <Link href={`/songs/${song.slug}`} prefetch={false} className="text-primary">
            {item.song_title || song.title}
          </Link>
        ) : (
          <>{item.song_title}</>
        )}
      </div>
      {item.encore && <div className="text-sm text-gray-500">（アンコール）</div>}
    </div>
  )
}

export default EventSetlistItem
