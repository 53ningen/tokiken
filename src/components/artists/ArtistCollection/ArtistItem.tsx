import { Artist } from '@/db/artists'
import Link from 'next/link'
import { FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'

export interface ArtistItemProps {
  item: Artist
}

const ArtistItem = ({ item }: ArtistItemProps) => {
  const { id, name, kana, twitter_screenname, instagram_id, tiktok_id } = item
  return (
    <Link href={`/artists/${id}`} prefetch={false}>
      <div className=" min-h-20 rounded-lg border p-2 text-left bg-white hover:bg-gray-100">
        <div className="text-sm font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
          {name}
        </div>
        {twitter_screenname && (
          <div className="flex text-xs text-gray-500">
            <span className="pr-1 flex items-center">
              <FaTwitter />
            </span>
            <span>{twitter_screenname}</span>
          </div>
        )}
        {instagram_id && (
          <div className="flex text-xs text-gray-500">
            <span className="pr-1 flex items-center">
              <FaInstagram />
            </span>
            <span>{instagram_id}</span>
          </div>
        )}
        {tiktok_id && (
          <div className="flex text-xs text-gray-500">
            <span className="pr-1 flex items-center">
              <FaTiktok />
            </span>
            <span>{tiktok_id}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ArtistItem
