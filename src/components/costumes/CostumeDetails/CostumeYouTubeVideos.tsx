import SectionHeading from '@/components/commons/SectionHeading'
import VideoItem from '@/components/contents/youtube/VideoCollection/VideoItem'
import { listYouTubeVideosByCostume } from '@/db/youtube-vidoes'

interface Props {
  costumeId: number
}

const CostumeYouTubeVideos = async ({ costumeId }: Props) => {
  const videos = await listYouTubeVideosByCostume(costumeId)()

  return videos.length > 0 ? (
    <div>
      <SectionHeading title="🎬 関連 YouTube 動画" />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 [&_]:text-left">
        {videos.map((video) => {
          return <VideoItem key={video.id} video={video} showChannel={true} />
        })}
      </div>
    </div>
  ) : (
    <></>
  )
}

export default CostumeYouTubeVideos
