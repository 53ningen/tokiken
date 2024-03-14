import { YouTubeVideosPerPage } from '@/app/(contents)/youtube/const'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Pagenation from '@/components/commons/Pagenation/Pagenation'
import Title from '@/components/commons/Title'
import VideoCollection from '@/components/contents/youtube/VideoCollection/VideoCollection'
import { getYouTubeChannel } from '@/db/youtube-channels'
import { listYouTubeVideosByChannel } from '@/db/youtube-vidoes'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string; page: string }
}

export const generateStaticParams = async () => {
  return []
}

const YouTubeChannelVideosPage = async ({ params }: Props) => {
  const { id } = params
  const page = parseInt(params.page as string)
  if (isNaN(page) || page < 1) {
    notFound()
  }
  const cachedYouTubeChannel = getYouTubeChannel(id)
  const channel = await cachedYouTubeChannel()
  if (!channel) {
    notFound()
  }
  const offset = (page - 1) * YouTubeVideosPerPage
  const cachedVideos = listYouTubeVideosByChannel(id, offset, YouTubeVideosPerPage + 1)
  const videos = await cachedVideos()
  if (videos.length === 0) {
    notFound()
  }
  const hasNext = videos.length > YouTubeVideosPerPage
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs
        items={[
          { name: 'YouTube', href: '/youtube' },
          {
            name: `${channel.title}`,
            href: `/youtube/channels/${id}}`,
          },
        ]}
      />
      <Title
        title="超ときめき♡YouTubeデータベース"
        description={`「${channel.title}」の動画一覧`}
      />
      <VideoCollection videos={videos.slice(0, YouTubeVideosPerPage)} />
      <Pagenation
        current={page}
        hasNext={hasNext}
        path={(page) => `/youtube/channels/${id}/pages/${page}`}
      />
    </Container>
  )
}

export default YouTubeChannelVideosPage
