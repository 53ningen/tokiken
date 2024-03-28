import { youtubeThumbnailUrl, youtubeVideoUrl } from '@/consts/metadata'
import { Event, listEventYouTubeVideos } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventYouTubeVideoList = async ({ event, showHeading = false }: Props) => {
  const videos = await listEventYouTubeVideos(event.id)()
  return (
    <>
      {videos.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="📝 関連 YouTube 動画" />}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="relative rounded overflow-hidden aspect-video">
                <a
                  href={youtubeVideoUrl(video.id)}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img
                    src={youtubeThumbnailUrl(video.id)}
                    alt={video.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1">
                    <div className="text-xs">{video.published_at}</div>
                    <div className="text-sm h-9">{video.title}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default EventYouTubeVideoList
