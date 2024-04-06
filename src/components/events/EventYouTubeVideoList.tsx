import { Event, listEventYouTubeVideos } from '@/db/events'
import YouTubeVideoList from '../contents/youtube/YouTubeVideoList'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventYouTubeVideoList = async ({ event, showHeading = false }: Props) => {
  const videos = await listEventYouTubeVideos(event.id)()
  return <YouTubeVideoList videos={videos} showHeading={showHeading} />
}

export default EventYouTubeVideoList
