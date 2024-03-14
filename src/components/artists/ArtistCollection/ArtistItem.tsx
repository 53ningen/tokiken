import { noImageUrl } from '@/consts/metadata'
import { Artist } from '@/db/artists'
import { Song, SongCredit } from '@/db/songs'
import Link from 'next/link'

export interface ArtistItemProps {
  item: Artist & {
    song_credits?: (SongCredit & { songs: Song })[]
  }
}

const ArtistItem = ({ item }: ArtistItemProps) => {
  const { id, name } = item
  const src = getImageSrc({ item })
  return (
    <Link href={`/artists/${id}`} prefetch={false}>
      <div className="flex items-center  rounded-lg border text-left bg-white hover:bg-gray-100">
        <img src={src} alt={name} className="w-12 h-12 object-cover rounded-l" />
        <div className="p-2 text-sm font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
          {name}
        </div>
      </div>
    </Link>
  )
}

const getImageSrc = ({ item }: ArtistItemProps) => {
  const song = item.song_credits?.map((i) => i.songs)?.[0]
  return song?.thumbnail_url || noImageUrl
}

export default ArtistItem
