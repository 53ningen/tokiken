import { noImageUrl } from '@/consts/metadata'
import { Song, SongCredit } from '@/db/songs'
import Link from 'next/link'
import { getCreditTitle } from '../credit'

interface Props {
  credit: SongCredit & { songs: Song }
}

const SongCreditItem = ({ credit }: Props) => {
  const { title, name, role, songs: song } = credit
  return (
    <Link href={`/songs/${song.slug}`} prefetch={false}>
      <div className="bg-white hover:bg-gray-100 rounded-lg border text-left [&_div]:overflow-hidden [&_div]:overflow-ellipsis [&_div]:whitespace-nowrap">
        <div className="col-span-1">
          <img
            className="w-full object-cover aspect-square"
            src={song.thumbnail_url || noImageUrl}
            alt={song.title}
            loading="lazy"
          />
        </div>
        <div className="col-span-1 p-2 grid gap-1">
          <div className="text-sm font-semibold">{song.title}</div>
          <div className="text-xs text-gray-500">{title || getCreditTitle(role)}</div>
          <div className="text-xs text-gray-500">{name}</div>
          <div></div>
        </div>
      </div>
    </Link>
  )
}

export default SongCreditItem
