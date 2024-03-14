import { noImageUrl, youtubeThumbnailUrl, youtubeVideoUrl } from '@/consts/metadata'
import { YouTubeVideoWithChannel } from '@/db/youtube-vidoes'
import Link from 'next/link'

interface Props {
  video: YouTubeVideoWithChannel
  showChannel?: boolean
}

const VideoItem = ({ video, showChannel }: Props) => {
  return (
    <Link
      href={youtubeVideoUrl(video.id)}
      target="_blank"
      className="hover:bg-gray-200 rounded-lg">
      <div>
        <img
          src={youtubeThumbnailUrl(video.id) || noImageUrl}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
      </div>
      <div className="p-1 grid gap-1">
        <div className="text-xs text-gray-500">{video.published_at}</div>
        <div className="text-xs">{video.title}</div>
        {showChannel && (
          <div className="text-xs text-gray-500">{video.youtube_channels.title}</div>
        )}
      </div>
    </Link>
  )
}

export default VideoItem
