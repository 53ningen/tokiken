import { listYouTubeVideoTypes } from '@/db/youtube-types'
import VideoTypeItem from './VideoTypeItem'

const VideoTypeCollection = async () => {
  const types = await listYouTubeVideoTypes()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-left">
      {types.map((type) => (
        <VideoTypeItem key={type.id} type={type} />
      ))}
    </div>
  )
}

export default VideoTypeCollection
