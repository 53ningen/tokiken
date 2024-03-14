import { YouTubeVideoWithChannel } from '@/db/youtube-vidoes'
import VideoItem from './VideoItem'

interface Props {
  videos: YouTubeVideoWithChannel[]
  showChannel?: boolean
}

const VideoCollection = ({ videos, showChannel = false }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 [&_]:text-left">
      {videos.map((video) => {
        return <VideoItem key={video.id} video={video} showChannel={showChannel} />
      })}
    </div>
  )
}

export default VideoCollection
