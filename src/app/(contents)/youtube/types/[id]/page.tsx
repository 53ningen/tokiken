import { YouTubeVideosPerPage } from '@/app/(contents)/youtube/const'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Pagenation from '@/components/commons/Pagenation/Pagenation'
import Title from '@/components/commons/Title'
import VideoCollection from '@/components/contents/youtube/VideoCollection/VideoCollection'
import { getYouTubeVideoType } from '@/db/youtube-types'
import { listYouTubeVideosByVideoType } from '@/db/youtube-vidoes'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export const generateStaticParams = async () => {
  return []
}

const YouTubeTypeVideos = async ({ params }: Props) => {
  const id = parseInt(params.id)
  const page = 1
  const type = await getYouTubeVideoType(id)
  if (!type) {
    notFound()
  }
  const offset = (page - 1) * YouTubeVideosPerPage
  const cachedVideos = listYouTubeVideosByVideoType(id, offset, YouTubeVideosPerPage + 1)
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
            name: `${type.name}`,
            href: `/youtube/types/${id}`,
          },
        ]}
      />
      <Title
        title="超ときめき♡YouTubeデータベース"
        description={`「${type.name}」の動画一覧`}
      />
      <VideoCollection
        videos={videos.slice(0, YouTubeVideosPerPage)}
        showChannel={true}
      />
      <Pagenation
        current={page}
        hasNext={hasNext}
        path={(page) => `/youtube/types/${id}/pages/${page}`}
      />
    </Container>
  )
}

export default YouTubeTypeVideos
