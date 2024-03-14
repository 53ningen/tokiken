import { Artist } from '@/db/artists'
import { Song, SongCredit } from '@/db/songs'
import ArtistItem from './ArtistItem'

interface Props {
  artists: (Artist & {
    song_credits?: (SongCredit & { songs: Song })[]
  })[]
}

const ArtistCollection = async ({ artists }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {artists.map((artist) => (
        <ArtistItem key={artist.id} item={artist} />
      ))}
    </div>
  )
}

export default ArtistCollection
