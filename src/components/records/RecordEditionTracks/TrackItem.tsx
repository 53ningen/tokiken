import { RecordTrack } from '@/db/records'
import { Song, SongCredit } from '@/db/songs'
import Link from 'next/link'
import TrackCredit from './TrackCredit'

export interface TrackItemProps {
  item: RecordTrack & { songs?: Song & { song_credits: SongCredit[] } }
}

const TrackItem = ({ item }: TrackItemProps) => {
  const { track, songs: song, title } = item
  return (
    <div className="p-2 flex gap-2">
      <div className="select-none">{track.toString()}.</div>
      <div className="grid gap-2">
        <div className="font-medium">
          {song ? (
            <Link href={`/songs/${song.slug}`} prefetch={false} className="text-primary">
              {title}
            </Link>
          ) : (
            <>{title}</>
          )}
        </div>
        {song && (
          <div className="flex flex-wrap text-xs gap-2 text-gray-500">
            <TrackCredit role="Lyrics" credits={song.song_credits} />
            <TrackCredit role="Music" credits={song.song_credits} />
            <TrackCredit role="Arrangement" credits={song.song_credits} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackItem
