import { EventSetlist } from '@/db/events'
import { Song } from '@/db/songs'
import Link from 'next/link'

interface Props {
  item: EventSetlist & { songs?: Song }
}

const EventSetlistItem = ({ item }: Props) => {
  const song = item.songs
  return (
    <div className="p-1 flex gap-2">
      <div className="select-none">{item.order.toString()}.</div>
      <div className="grid gap-2">
        <div className="font-medium">
          {song ? (
            <Link href={`/songs/${song.slug}`} prefetch={false} className="text-primary">
              {item.song_title || song.title}
            </Link>
          ) : (
            <>{item.song_title}</>
          )}
        </div>
        {/* {song && (
          <div className="flex flex-wrap text-xs gap-2 text-gray-500">
            <TrackCredit role="Lyrics" credits={song} />
            <TrackCredit role="Music" credits={song.song_credits} />
            <TrackCredit role="Arrangement" credits={song.song_credits} />
          </div>
        )} */}
      </div>
    </div>
  )
}

export default EventSetlistItem
