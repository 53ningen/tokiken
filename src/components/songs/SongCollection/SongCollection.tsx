import { Song, SongCredit } from '@/db/songs'
import SongItem from './SongItem'

interface Props {
  songs: (Song & { song_credits: SongCredit[] })[]
}

const SongCollection = async ({ songs }: Props) => {
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {songs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </div>
  )
}

export default SongCollection
