import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import ChannelCollection from '@/components/contents/youtube/ChannelCollection/ChannelCollection'
import VideoTypeCollection from '@/components/contents/youtube/VideoTypeCollection/VideoTypeCollection'
import { Metadata } from 'next'

interface Props {}

const title = '超ときめき♡YouTubeデータベース'
const description = '超ときめき♡宣伝部のYouTubeのデータ'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

const Contents = async ({}: Props) => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'YouTube データベース', href: '/youtube' }]} />
      <Title title={title} description={description} />
      <div className="grid gap-16">
        <ChannelCollection />
        <VideoTypeCollection />
      </div>
    </Container>
  )
}

export default Contents
