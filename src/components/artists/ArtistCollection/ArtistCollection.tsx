import { Artist } from '@/db/artists'
import ArtistItem from './ArtistItem'

interface Props {
  artists: Artist[]
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
