import { Artist } from '@/db/artists'
import { Costume, CostumeImage } from '@/db/costumes'
import Link from 'next/link'
import CostumeImg from './CostumeImg'

interface Props {
  costume: Costume & { artists: Artist | null } & { costume_images: CostumeImage[] }
}

const CostumeItem = async ({ costume }: Props) => {
  const { artists: artist, costume_images: costumeImages } = costume
  const imageKey = costumeImages[0]?.image_key
  return (
    <Link
      href={`/costumes/${costume.id}`}
      prefetch={false}
      className="border hover:bg-gray-100 [&_div]:overflow-hidden [&_div]:text-ellipsis [&_div]:text-nowrap [&_div]:text-left rounded">
      <CostumeImg imageKey={imageKey} size="xs" alt={costume.name} />
      <div className="p-2">
        <div className="text-sm font-semibold">{costume.name}</div>
        {artist && <div className="text-xs text-gray-500">{artist.name}</div>}
      </div>
    </Link>
  )
}

export default CostumeItem
