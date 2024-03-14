import SectionHeading from '@/components/SectionHeading'
import { listYouTubeVidoesBySong } from '@/db/youtube-vidoes'
import VideoCollection from './VideoCollection'

interface Props {
  songId: number
  short: boolean
}

const SongVideoCollection = async ({ songId, short }: Props) => {
  const videos = await listYouTubeVidoesBySong(songId, short)()
  if (!videos.length) {
    return <></>
  } else {
    const label = short ? '🎞️ 関連 YouTube ショート' : '🎬 関連 YouTube 動画'
    return (
      <div className="py-4">
        <SectionHeading title={label} />
        <VideoCollection videos={videos} />
      </div>
    )
  }
}

export default SongVideoCollection
