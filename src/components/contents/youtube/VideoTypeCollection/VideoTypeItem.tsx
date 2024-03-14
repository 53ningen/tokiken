import { YouTubeVideoType } from '@/db/youtube-vidoes'
import Link from 'next/link'

interface Props {
  type: YouTubeVideoType
}

const VideoTypeItem = ({ type }: Props) => {
  return (
    <Link
      href={`/youtube/types/${type.id}`}
      prefetch={false}
      className="text-xs rounded-xl hover:bg-gray-200 border">
      <div className="grid grid-cols-4 content-center h-full">
        <div className="col-span-1 flex justify-center items-center w-full h-full">
          <span className="text-xl">{type.icon_emoji}</span>
        </div>
        <div className="col-span-3 px-2 flex items-center text-gray-500 overflow-hidden overflow-ellipsis">
          {type.slug}
        </div>
      </div>
    </Link>
  )
}

export default VideoTypeItem
