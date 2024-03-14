import { noImageUrl } from '@/consts/metadata'
import { Song, SongCredit } from '@/db/songs'
import Link from 'next/link'

interface SongItemProps {
  song: Song & { song_credits: SongCredit[] }
}

const SongItem = async ({ song }: SongItemProps) => {
  const { id, title, slug, thumbnail_url, song_credits: credits } = song
  const lyrics = credits
    .filter((c) => c.role === 'Lyrics')
    ?.map((c) => c.name)
    .join('/')
  const music = credits
    .filter((c) => c.role === 'Music')
    ?.map((c) => c.name)
    .join('/')
  const arrangers = credits
    .filter((c) => c.role === 'Arrangement')
    ?.map((c) => c.name)
    .join('/')
  return (
    <Link href={`/songs/${slug}`} prefetch={false}>
      <div className="grid grid-cols-3 bg-white hover:bg-gray-100 rounded-lg border overflow-hidden p-2 text-left">
        <div className="col-span-1">
          <img
            className="w-full object-cover aspect-square"
            src={thumbnail_url || noImageUrl}
            alt={title}
            loading="lazy"
          />
        </div>
        <div className="col-span-2 pl-4">
          <div className="mb-2 tracking-wide text-sm font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
            {title}
          </div>
          {lyrics && (
            <div className="text-xs leading-5 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-400">
              作詞: {lyrics}
            </div>
          )}
          {music && (
            <div className="text-xs leading-5 text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap">
              作曲: {music}
            </div>
          )}
          {arrangers && (
            <div className="text-xs leading-5 text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap">
              編曲: {arrangers}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default SongItem
