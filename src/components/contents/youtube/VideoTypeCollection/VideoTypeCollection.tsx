import SectionHeading from '@/components/SectionHeading'
import { listYouTubeVideoTypes } from '@/db/youtube-types'
import VideoTypeItem from './VideoTypeItem'

const VideoTypeCollection = async () => {
  const types = await listYouTubeVideoTypes()
  return (
    <div>
      <SectionHeading title="🎬 動画ジャンル" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-left">
        {types.map((type) => (
          <VideoTypeItem key={type.id} type={type} />
        ))}
      </div>
    </div>
  )
}

export default VideoTypeCollection
